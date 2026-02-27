import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { Tournament } from "@dotabot.js/domain/data/Tournament";
import type { TournamentIteration } from "@dotabot.js/domain/data/TournamentIteration";
import type { TournamentPhase } from "@dotabot.js/domain/data/TournamentPhase";
import type { EmbedBuilder } from "discord.js";

export interface TournamentEmbedMessageBuilder {
  buildTournamentMessage(
    channelConfig: ChannelConfiguration,
    tournament: Tournament,
    iteration: TournamentIteration,
    phase: TournamentPhase,
  ): EmbedBuilder | undefined;
}
