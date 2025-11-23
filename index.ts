// import { Client, Events, GatewayIntentBits } from "discord.js";

// import { ZodError } from "zod";
// import { Client as DiscordClient, Events, GatewayIntentBits } from 'discord.js';
// import { Client as PandaScoreClient } from "./pandascorejs/Client";
// import { DateTime } from "luxon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "./generated/prisma/client";

const pandaScoreToken = process.env.PANDASCORE_TOKEN;
if(!pandaScoreToken) {
    throw new Error('No PandaScore token provided');
}

// const client = new DiscordClient({ intents: [GatewayIntentBits.Guilds] });
// client.once(Events.ClientReady, (readyClient) => {
//     console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });

// client.login(process.env.DISCORD_TOKEN);

// const pandascore = new PandaScoreClient(pandaScoreToken);
// (async () => {
//     try {
//         const earliest = DateTime.utc();//.minus({days: 2});
//         const latest = DateTime.utc().plus({days: 2});
//         const matches = await pandascore.matches.getDota2Matches({
//             range: {
//                 beginAt: [earliest.toISO(), latest.toISO()]
//             }
//         });
//         console.log(`Success! Match count: ${matches.length}`);
//     }
//     catch(err: unknown) {
//         console.error(err);
//         if(err instanceof ZodError) {
//             console.log(err.message);
//         }
//     }
// })();

(async () => {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({connectionString});
    const prisma = new PrismaClient({adapter});
    const channelConfiguration = await prisma.channelConfiguration.create({
        data: {
            channelId: 898676943610851358n
        }
    });
    console.log(`Created channel config ${channelConfiguration.id}`);
})();