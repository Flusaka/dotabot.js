import {
  ApplicationCommandOptionType,
  channelMention,
  type CommandInteraction,
} from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import { Types } from "../di/Types";
import { botContainer } from "../di/Container";
import {
  ConnectionResult,
  DisconnectionResult,
  type ConnectionService,
} from "../services/interfaces/ConnectionService";
import { Language } from "../domain/Language";
import {
  SetNotificationTimezoneResult,
  SetPreferredLanguageResult,
  type ConfigurationService,
} from "../services/interfaces/ConfigurationService";
import { Timezone } from "../domain/Timezone";
import {
  GetTournamentsWithMatchesTodayResult,
  type TournamentService,
} from "../services/interfaces/TournamentService";
import type { TournamentEmbedMessageBuilder } from "../message/interfaces/TournamentEmbedMessageBuilder";

const LanguageTextChoices = {
  [Language.English]: "English",
};

const TimezoneTextChoices = {
  [Timezone.GMT]: "GMT",
  [Timezone.EET]: "EET",
};

@Discord()
class Root {
  private connectionService: ConnectionService;
  private configurationService: ConfigurationService;
  private tournamentService: TournamentService;
  private tournamentMessageBuilder: TournamentEmbedMessageBuilder;

  constructor() {
    this.connectionService = botContainer.get<ConnectionService>(
      Types.ConnectionService,
    );
    this.configurationService = botContainer.get<ConfigurationService>(
      Types.ConfigurationService,
    );
    this.tournamentService = botContainer.get<TournamentService>(
      Types.TournamentService,
    );
    this.tournamentMessageBuilder =
      botContainer.get<TournamentEmbedMessageBuilder>(
        Types.TournamentEmbedMessageBuilder,
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
    switch (result.result) {
      case GetTournamentsWithMatchesTodayResult.Success: {
        for (const tournament of result.data!) {
          for (const iteration of tournament.iterations) {
            for (const phase of iteration.phases) {
              const embed =
                this.tournamentMessageBuilder.buildTournamentMessage(
                  tournament,
                  iteration,
                  phase,
                );

              // If we've not replied yet, reply now, and follow up the rest
              if (!interaction.replied) {
                await interaction.editReply({ embeds: [embed] });
              } else {
                await interaction.followUp({ embeds: [embed] });
              }
            }
          }
        }
        break;
      }
      case GetTournamentsWithMatchesTodayResult.ChannelNotConnected: {
        await interaction.editReply(
          `DotaBot is not currently connected to ${channelMention(interaction.channelId)}! Run /connect first!`,
        );
        break;
      }
      case GetTournamentsWithMatchesTodayResult.NoMatchesToday: {
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
      type: ApplicationCommandOptionType.Number,
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
      type: ApplicationCommandOptionType.Number,
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
