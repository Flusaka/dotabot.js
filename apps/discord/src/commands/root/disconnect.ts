import {
  DisconnectionResult,
  type ConnectionService,
} from "@dotabot.js/domain/service/ConnectionService";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { botContainer } from "di/container";
import { channelMention } from "discord.js";

export class DisconnectCommand extends Command {
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
        .setName("disconnect")
        .setDescription("Disconnect this channel from DotaBot"),
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    await interaction.deferReply();
    const channelId = BigInt(interaction.channelId);
    const result = await this._connectionService.disconnect(channelId);
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
}
