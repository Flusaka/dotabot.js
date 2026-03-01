import {
  ApplicationCommandOptionType,
  channelMention,
  type CommandInteraction,
} from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import { botContainer } from "../di/Container";
import {
  ConnectionResult,
  DisconnectionResult,
  type ConnectionService,
} from "@dotabot.js/domain/service/ConnectionService";
import { Language } from "@dotabot.js/domain/Language";
import {
  SetNotificationTimezoneResult,
  SetPreferredLanguageResult,
  type ConfigurationService,
} from "@dotabot.js/domain/service/ConfigurationService";
import { Timezone } from "@dotabot.js/domain/Timezone";
import {
  GetTournamentsWithMatchesTodayResultStatus,
  type TournamentService,
} from "@dotabot.js/domain/service/TournamentService";
import type { TournamentEmbedMessageBuilder } from "../message/interfaces/TournamentEmbedMessageBuilder";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";
import { Symbols } from "../di/Symbols";

const LanguageTextChoices = {
  [Language.English]: "English",
} as const;

const TimezoneTextChoices = {
  [Timezone.GMT]: "GMT",
  [Timezone.EET]: "EET",
} as const;

@Discord()
class Root {
  private connectionService: ConnectionService;
  private configurationService: ConfigurationService;
  private tournamentService: TournamentService;
  private tournamentMessageBuilder: TournamentEmbedMessageBuilder;

  constructor() {
    this.connectionService = botContainer.get<ConnectionService>(
      SharedSymbols.ConnectionService,
    );
    this.configurationService = botContainer.get<ConfigurationService>(
      SharedSymbols.ConfigurationService,
    );
    this.tournamentService = botContainer.get<TournamentService>(
      SharedSymbols.TournamentService,
    );
    this.tournamentMessageBuilder =
      botContainer.get<TournamentEmbedMessageBuilder>(
        Symbols.TournamentEmbedMessageBuilder,
      );
  }

  @Slash({ description: "Connect this channel to DotaBot", name: "connect" })
  async connect(interaction: CommandInteraction) {
    await interaction.deferReply();
    const channelId = BigInt(interaction.channelId);
    const result = await this.connectionService.connect(channelId);
    switch (result) {
      case ConnectionResult.Success: {
        await interaction.editReply(
          `DotaBot successfully connected to ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case ConnectionResult.ChannelAlreadyConnected: {
        await interaction.editReply(
          `DotaBot is already connected to ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      default: {
        await interaction.editReply(
          `DotaBot couldn't be connected to ${channelMention(interaction.channelId)} at the moment :( Please try again later!`,
        );
        break;
      }
    }
  }

  @Slash({
    description: "Disconnect this channel from DotaBot",
    name: "disconnect",
  })
  async disconnect(interaction: CommandInteraction) {
    await interaction.deferReply();
    const channelId = BigInt(interaction.channelId);
    const result = await this.connectionService.disconnect(channelId);
    switch (result) {
      case DisconnectionResult.Success: {
        await interaction.editReply(
          `DotaBot successfully disconnected from ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case DisconnectionResult.ChannelNotConnected: {
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}, no need to disconnect!`,
        );
        break;
      }
      default: {
        await interaction.editReply(
          `DotaBot couldn't be disconnected from ${channelMention(interaction.channelId)} at the moment :( Please try again later!`,
        );
        break;
      }
    }
  }

  @Slash({
    description: "Get all matches taking place today",
    name: "today",
  })
  async today(interaction: CommandInteraction) {
    await interaction.deferReply();
    const channelId = BigInt(interaction.channelId);
    const result =
      await this.tournamentService.getTournamentsWithMatchesToday(channelId);
    switch (result.status) {
      case GetTournamentsWithMatchesTodayResultStatus.Success: {
        const channelConfig =
          await this.configurationService.getConfiguration(channelId);

        for (const tournament of result.data) {
          for (const iteration of tournament.iterations) {
            for (const phase of iteration.phases) {
              const embed =
                this.tournamentMessageBuilder.buildTournamentMessage(
                  channelConfig!,
                  tournament,
                  iteration,
                  phase,
                );

              if (!embed) continue;

              // If we've not replied yet, reply now, and follow up the rest
              if (!interaction.replied) {
                await interaction.editReply({ embeds: [embed] });
              } else {
                await interaction.followUp({ embeds: [embed] });
              }
            }
          }
        }

        if (!interaction.replied) {
          await interaction.editReply(":robot: No matches today!");
        }
        break;
      }
      case GetTournamentsWithMatchesTodayResultStatus.ChannelNotConnected: {
        // TODO: Pull command ID back to do proper link
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}! Run /connect first!`,
        );
        break;
      }
      case GetTournamentsWithMatchesTodayResultStatus.NoMatchesToday: {
        await interaction.editReply("No matches today!");
      }
    }
  }

  @Slash({
    description:
      "Set the preferred language in which to receive stream suggestions",
    name: "language",
  })
  async setLanguage(
    @SlashChoice({
      name: LanguageTextChoices[Language.English],
      value: Language.English,
    })
    @SlashOption({
      description: "Language of your choice",
      name: "language",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    language: Language,
    interaction: CommandInteraction,
  ) {
    await interaction.deferReply();
    const channelId = BigInt(interaction.channelId);
    const result = await this.configurationService.setPreferredLanguage(
      channelId,
      language,
    );
    switch (result) {
      case SetPreferredLanguageResult.Success: {
        await interaction.editReply(
          `Preferred language has been set to ${LanguageTextChoices[language]} for ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case SetPreferredLanguageResult.ChannelNotConnected: {
        // TODO: Pull command ID back to do proper link
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}! Run /connect first!`,
        );
        break;
      }
      case SetPreferredLanguageResult.UnknownError: {
        await interaction.editReply(
          `DotaBot couldn't set the preferred language for ${channelMention(interaction.channelId)} at the moment :( Please try again later!`,
        );
        break;
      }
    }
  }

  @Slash({
    description: "Set the timezone for channel notifications",
    name: "timezone",
  })
  async setTimezone(
    @SlashChoice(
      {
        name: TimezoneTextChoices[Timezone.GMT],
        value: Timezone.GMT,
      },
      {
        name: TimezoneTextChoices[Timezone.EET],
        value: Timezone.EET,
      },
    )
    @SlashOption({
      description: "The selected timezone",
      name: "timezone",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    timezone: Timezone,
    interaction: CommandInteraction,
  ) {
    await interaction.deferReply();
    const channelId = BigInt(interaction.channelId);
    const result = await this.configurationService.setNotificationTimezone(
      channelId,
      timezone,
    );
    switch (result) {
      case SetNotificationTimezoneResult.Success: {
        await interaction.editReply(
          `Preferred language has been set to ${TimezoneTextChoices[timezone]} for ${channelMention(interaction.channelId)}!`,
        );
        break;
      }
      case SetNotificationTimezoneResult.ChannelNotConnected: {
        // TODO: Pull command ID back to do proper link
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}! Run /connect first!`,
        );
        break;
      }
      case SetNotificationTimezoneResult.UnknownError: {
        await interaction.editReply(
          `DotaBot couldn't set the notification timezone for ${channelMention(interaction.channelId)} at the moment :( Please try again later!`,
        );
        break;
      }
    }
  }
}
