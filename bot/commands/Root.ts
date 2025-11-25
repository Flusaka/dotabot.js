import { channelMention, type CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { Types } from "../di/Types";
import { botContainer } from "../di/Container";
import { ConnectionResult, type ConnectionService } from "../services/interfaces/ConnectionService";

@Discord()
class Root {
    private connectionService: ConnectionService;

    constructor() {
        this.connectionService = botContainer.get<ConnectionService>(Types.ConnectionService);
    }

    @Slash({description: 'Connect this channel to DotaBot', name: 'connect'})
    async connect(interaction: CommandInteraction) {
        await interaction.deferReply();
        const channelId = BigInt(interaction.channelId);
        const result = await this.connectionService.connect(channelId);
        switch(result) {
            case ConnectionResult.Success: {
                await interaction.editReply(`DotaBot successfully connected to ${channelMention(interaction.channelId)}`);
                break;
            }
            case ConnectionResult.ChannelAlreadyConnected: {
                await interaction.editReply(`DotaBot is already connected to ${channelMention(interaction.channelId)}`);
                break;
            }
            default: {
                await interaction.editReply(`DotaBot couldn't be connected to ${channelMention(interaction.channelId)} at the moment :( Please try again later!`);
                break;
            }
        }
    }
}