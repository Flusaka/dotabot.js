import { Listener } from "@sapphire/framework";
import type { Guild } from "discord.js";
import { botContainer } from "../di/container";
import { Symbols } from "@dotabot.js/shared/Symbols";
import type { ConnectionService } from "@dotabot.js/domain/service/ConnectionService";

export class GuildDeleteListener extends Listener {
  private readonly connectionService: ConnectionService;

  constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      event: "guildDelete",
    });

    this.connectionService = botContainer.get<ConnectionService>(
      Symbols.ConnectionService,
    );
  }

  async run(guild: Guild) {
    console.log(`Bot has been removed from guild ${guild.name} - ${guild.id}`);
    await this.connectionService.disconnectAll(guild.id);
  }
}
