import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
class Root {
    @Slash({description: 'Connect DotaBot to this channel', name: 'connect'})
    async connect(interaction: CommandInteraction) {
        await interaction.deferReply();
        await interaction.editReply('DotaBot is now connected!');
    }
}