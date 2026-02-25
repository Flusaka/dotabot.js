import type { EmbedBuilder } from "discord.js";
import type { Tournament } from "../../domain/data/Tournament";
import type { TournamentIteration } from "../../domain/data/TournamentIteration";
import type { TournamentPhase } from "../../domain/data/TournamentPhase";
import type { ChannelConfiguration } from "../../domain/ChannelConfiguration";

export interface TournamentEmbedMessageBuilder {
  buildTournamentMessage(
    channelConfig: ChannelConfiguration,
    tournament: Tournament,
    iteration: TournamentIteration,
    phase: TournamentPhase,
  ): EmbedBuilder | undefined;
}
