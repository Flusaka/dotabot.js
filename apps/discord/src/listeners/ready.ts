import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";

export class ReadyListener extends Listener {
  constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      once: true,
      event: "clientReady",
    });
  }

  run(client: Client) {
    const { username, id } = client.user!;
    this.container.logger.info(`Successfully logged in as ${username} (${id})`);
  }
}
