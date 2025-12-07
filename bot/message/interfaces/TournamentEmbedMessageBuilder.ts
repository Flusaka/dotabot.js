import type { EmbedBuilder } from "discord.js";
import type { Tournament } from "../../domain/data/Tournament";
import type { TournamentIteration } from "../../domain/data/TournamentIteration";
import type { TournamentPhase } from "../../domain/data/TournamentPhase";

export interface TournamentEmbedMessageBuilder {
  buildTournamentMessage(
    tournament: Tournament,
    iteration: TournamentIteration,
    phase: TournamentPhase,
  ): EmbedBuilder;
}
