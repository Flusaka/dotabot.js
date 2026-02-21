import { EmbedBuilder, hyperlink, time, TimestampStyles } from "discord.js";
import type { Tournament } from "../domain/data/Tournament";
import type { TournamentEmbedMessageBuilder } from "./interfaces/TournamentEmbedMessageBuilder";
import type { TournamentIteration } from "../domain/data/TournamentIteration";
import type { TournamentPhase } from "../domain/data/TournamentPhase";
import type { Match, MatchOpponent } from "../domain/data/Match";
import { Opponent } from "../domain/data/Opponent";
import { Types } from "../di/Types";
import type { StreamSelector } from "../selectors/interfaces/StreamSelector";
import { inject, injectable } from "inversify";
import { Language } from "../domain/Language";
import { ChannelConfiguration } from "../domain/ChannelConfiguration";
import { Timezone } from "../domain/Timezone";

@injectable()
export class TournamentEmbedMessageBuilderImpl implements TournamentEmbedMessageBuilder {
  constructor(
    @inject(Types.StreamSelector) private streamSelector: StreamSelector,
  ) {}

  buildTournamentMessage(
    tournament: Tournament,
    iteration: TournamentIteration,
    phase: TournamentPhase,
  ): EmbedBuilder | undefined {
    if (phase.matches.length === 0) {
      return;
    }
    const matches = this.getMatchesPerStream(phase.matches);
    if (matches.size === 0) {
      return;
    }

    const title = this.getTournamentTitle(tournament, iteration, phase);
    const builder = new EmbedBuilder()
      .setTitle(`:robot: ${title} games today!`)
      .setColor("Aqua")
      .setDescription(
        `Tournament data provided by ${hyperlink("PandaScore", "https://www.pandascore.co/")}`,
      );

    // key = stream URL
    // value = matches array
    for (const [key, value] of matches) {
      builder.addFields({
        name: `Matches on ${key}`,
        value: value
          .map(
            (match) =>
              `${time(match.scheduledAt.toJSDate(), TimestampStyles.ShortTime)} - ${this.getOpponentName(match.radiant)} vs ${this.getOpponentName(match.dire)}`,
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
      if (match.streams.length === 0) {
        continue;
      }
      const preferredStream =
        this.streamSelector.findPreferredStream(
          match.streams,
          new ChannelConfiguration(0n, [], Timezone.GMT, Language.English),
        ) || match.streams[0]!;

      let streamMatches = perStreamMatches.get(preferredStream.url);
      if (streamMatches && streamMatches.length > 0) {
        streamMatches = [match, ...streamMatches];
      } else {
        streamMatches = [match];
      }

      perStreamMatches.set(preferredStream.url, streamMatches);
    }

    return perStreamMatches;
  }

  isOpponentKnown(opponent: MatchOpponent): opponent is Opponent | Opponent[] {
    return opponent !== undefined;
  }

  isSingleOpponent(opponent: MatchOpponent): opponent is Opponent {
    return opponent instanceof Opponent && !Array.isArray(opponent);
  }

  getOpponentName(opponent: MatchOpponent) {
    if (!this.isOpponentKnown(opponent)) {
      return "TBD";
    }

    if (this.isSingleOpponent(opponent)) {
      return opponent.name;
    }

    return opponent.map((opponent) => opponent.name).join("/");
  }
}
