import { GatewayIntentBits } from "discord.js";
import { Client } from "discordx";
import { Bot } from "./Bot";

const discordToken = process.env.DISCORD_TOKEN;
if (!discordToken) {
  throw new Error("No Discord token provided");
}

const pandascoreToken = process.env.PANDASCORE_TOKEN;
if (!pandascoreToken) {
  throw new Error("No PandaScore token provided");
}

const guildId = process.env.GUILD_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  botGuilds: guildId ? [guildId] : undefined,
  silent: false,
});
const bot = new Bot(client);
await bot.init(discordToken);
