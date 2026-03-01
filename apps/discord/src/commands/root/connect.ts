import {
  ConnectionResult,
  type ConnectionService,
} from "@dotabot.js/domain/service/ConnectionService";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { botContainer } from "di/container";
import { channelMention } from "discord.js";

export class ConnectCommand extends Command {
  private readonly _connectionService: ConnectionService;

  constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
    this._connectionService = botContainer.get<ConnectionService>(
      SharedSymbols.ConnectionService,
    );
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry,
  ) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("connect")
        .setDescription("Connect this channel to DotaBot"),
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    await interaction.deferReply();
    const channelId = BigInt(interaction.channelId);
    const result = await this._connectionService.connect(channelId);
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
}
