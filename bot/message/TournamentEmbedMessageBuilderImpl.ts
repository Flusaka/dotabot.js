import { EmbedBuilder, hyperlink, time, TimestampStyles } from "discord.js";
import type { Tournament } from "../domain/data/Tournament";
import type { TournamentEmbedMessageBuilder } from "./interfaces/TournamentEmbedMessageBuilder";
import type { TournamentIteration } from "../domain/data/TournamentIteration";
import type { TournamentPhase } from "../domain/data/TournamentPhase";
import type { Match } from "../domain/data/Match";

export class TournamentEmbedMessageBuilderImpl implements TournamentEmbedMessageBuilder {
  buildTournamentMessage(
    tournament: Tournament,
    iteration: TournamentIteration,
    phase: TournamentPhase,
  ): EmbedBuilder {
    const title = this.getTournamentTitle(tournament, iteration, phase);
    const builder = new EmbedBuilder()
      .setTitle(`:robot: ${title} games today!`)
      .setColor("Aqua")
      .setDescription(
        `Tournament data provided by ${hyperlink("PandaScore", "https://www.pandascore.co/")}`,
      );

    const matches = this.getMatchesPerStream(phase.matches);
    for (const [key, value] of matches) {
      builder.addFields({
        name: `Matches on ${key}`,
        value: value
          .map(
            (match) =>
              `${time(match.scheduledAt.toJSDate(), TimestampStyles.ShortTime)} - Match ${key}`,
          )
          .join("\n"),
      });
    }

    return builder;
  }

  getTournamentTitle(
    tournament: Tournament,
    iteration: TournamentIteration,
    phase: TournamentPhase,
  ): string {
    let title = "";
    if (tournament.name.length > 0) {
      title += tournament.name;
    }

    if (iteration.name.length > 0) {
      if (title.length > 0) {
        title += ": ";
      }
      title += iteration.name;
    }

    if (title.length > 0) {
      title += " - ";
    }

    title += phase.name;
    return title;
  }

  getMatchesPerStream(matches: Match[]): Map<string, Match[]> {
    const perStreamMatches = new Map<string, Match[]>();
    for (const match of matches) {
      perStreamMatches.set(match.id.toString(), [match]);
    }

    return perStreamMatches;
  }
}
