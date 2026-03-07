import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";

const discordToken = process.env.DISCORD_TOKEN;
if (!discordToken) {
  throw new Error("No Discord token provided");
}

const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.login(discordToken);
