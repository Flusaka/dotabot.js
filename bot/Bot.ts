import type { Client as DiscordClient } from "discordx";
import { Events } from "discord.js";
import { dirname, importx } from "@discordx/importer";

export class Bot {
  private client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }

  public async init(token: string) {
    this.client.once(Events.ClientReady, async () => {
      console.log(`DotaBot is ready! User ID ${this.client.user?.id}`);

      await this.client.initApplicationCommands();

      console.log("Commands initialised!");
    });

    this.client.on(Events.InteractionCreate, (interaction) => {
      this.client.executeInteraction(interaction);
    });

    console.log(`${dirname(import.meta.url)}/commands/**/*.{js,ts}`);
    await importx(`${dirname(import.meta.url)}/commands/**/*.{js,ts}`);
    await this.client.login(token);
  }
}
