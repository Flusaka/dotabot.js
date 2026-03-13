import { type ConfigurationService } from "@dotabot.js/domain/service/ConfigurationService";
import {
  GetTournamentsWithMatchesTodayResultStatus,
  type TournamentService,
} from "@dotabot.js/domain/service/TournamentService";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { botContainer } from "di/container";
import { Symbols } from "di/symbols";
import { channelMention } from "discord.js";
import { TournamentEmbedMessageBuilder } from "message/TournamentEmbedMessageBuilder";

export class TodayCommand extends Command {
  private readonly configurationService: ConfigurationService;
  private readonly tournamentService: TournamentService;
  private readonly tournamentMessageBuilder: TournamentEmbedMessageBuilder;

  constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });

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

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry,
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("today")
        .setDescription("Get all matches taking place today"),
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    await interaction.deferReply();

    const channelId = BigInt(interaction.channelId);

    const result =
      await this.tournamentService.getTournamentsWithMatchesToday(channelId);
    switch (result.status) {
      case GetTournamentsWithMatchesTodayResultStatus.Success: {
        const channelConfig =
          await this.configurationService.getConfiguration(channelId);

        const embeds = this.tournamentMessageBuilder.build(
          channelConfig!,
          result.data,
        );

        for (const embed of embeds) {
          // If we've not replied yet, reply now, and follow up the rest
          if (!interaction.replied) {
            await interaction.editReply({ embeds: [embed] });
          } else {
            await interaction.followUp({ embeds: [embed] });
          }
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
}
