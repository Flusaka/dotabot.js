// import { Client, Events, GatewayIntentBits } from "discord.js";

import { ZodError } from "zod";
import { Client } from "./pandascorejs/Client";

// const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// client.once(Events.ClientReady, (readyClient) => {
//     console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });

// client.login(process.env.DISCORD_TOKEN);

const pandascore = new Client('8FG9WnjcQBp9FkS8PA6bTQAEKYQefsBhWBjOG_hC7VYu4vWLxNM');
(async () => {
    try {
        const matches = await pandascore.getMatches();
        console.log(`Success! Match count: ${matches.length}`);
    }
    catch(err: unknown) {
        console.error(err);
        if(err instanceof ZodError) {
            console.log(err.message);
        }
    }
})();
