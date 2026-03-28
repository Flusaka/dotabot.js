import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { Match, MatchOpponent } from "@dotabot.js/domain/data/Match";
import { Opponent } from "@dotabot.js/domain/data/Opponent";
import type { Tournament } from "@dotabot.js/domain/data/Tournament";
import type { TournamentIteration } from "@dotabot.js/domain/data/TournamentIteration";
import type { TournamentPhase } from "@dotabot.js/domain/data/TournamentPhase";
import type { StreamSelector } from "@dotabot.js/domain/selector/StreamSelector";
import {
  ContainerBuilder,
  hyperlink,
  SeparatorSpacingSize,
  time,
  TimestampStyles,
  type RGBTuple,
} from "discord.js";
import { injectable, inject } from "inversify";
import { Symbols } from "@dotabot.js/shared/Symbols";

const AccentColour: RGBTuple | number = 4688544;

@injectable()
export class TournamentEmbedMessageBuilder {
  constructor(
    @inject(Symbols.StreamSelector) private streamSelector: StreamSelector,
  ) {}

  build(
    channelConfig: ChannelConfiguration,
    tournaments: Tournament[],
  ): ContainerBuilder[] {
    const containers: ContainerBuilder[] = [];
    for (const tournament of tournaments) {
      for (const iteration of tournament.iterations) {
        for (const phase of iteration.phases) {
          const container = this.buildTournamentMessage(
            channelConfig,
            tournament,
            iteration,
            phase,
          );
          if (!container) continue;

          containers.push(container);
        }
      }
    }

    // If there's no embeds, there's no matches to report, at least push a "No matches today!" embed
    if (containers.length === 0) {
      containers.push(
        new ContainerBuilder()
          .setAccentColor(AccentColour)
          .addTextDisplayComponents((text) =>
            text.setContent("No matches today!"),
          ),
      );
    }

    return containers;
  }

  buildTournamentMessage(
    channelConfig: ChannelConfiguration,
    tournament: Tournament,
    iteration: TournamentIteration,
    phase: TournamentPhase,
  ): ContainerBuilder | undefined {
    if (phase.matches.length === 0) {
      return;
    }

    const matches = this.getMatchesPerStream(channelConfig, phase.matches);
    if (matches.size === 0) {
      return;
    }

    const title = this.getTournamentTitle(tournament, iteration, phase);
    let builder = new ContainerBuilder()
      .setAccentColor(AccentColour)
      .addSectionComponents(
        (section) =>
          section.addTextDisplayComponents((text) =>
            text.setContent(`### :robot: ${title} matches today!`),
          ),
        // TODO: Add back in when adding match notifications
        // .setButtonAccessory((button) =>
        //   button
        //     .setCustomId(`${phase.id}`)
        //     .setLabel("Notify me!")
        //     .setStyle(ButtonStyle.Success)
        //     .setEmoji({ name: "🔔" }),
        // ),
      )
      .addSeparatorComponents((separator) =>
        separator.setDivider(false).setSpacing(SeparatorSpacingSize.Small),
      );

    // key = stream URL
    // value = matches array
    for (const [key, value] of matches) {
      builder = builder
        .addTextDisplayComponents((text) =>
          text.setContent(`### Matches on ${key}`),
        )
        .addTextDisplayComponents((text) =>
          text.setContent(
            value
              .map(
                (match) =>
                  `${time(match.scheduledAt.toJSDate(), TimestampStyles.ShortTime)} - ${this.getOpponentName(match.radiant)} vs ${this.getOpponentName(match.dire)}`,
              )
              .join("\n"),
          ),
        )
        .addSeparatorComponents((separator) =>
          separator.setDivider(true).setSpacing(SeparatorSpacingSize.Small),
        );
    }

    builder = builder.addTextDisplayComponents((text) =>
      text.setContent(
        `Tournament data provided by ${hyperlink("PandaScore", "https://pandascore.co/")}`,
      ),
    );

    // console.log(builder.toJSON());

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

  getMatchesPerStream(
    channelConfig: ChannelConfiguration,
    matches: Match[],
  ): Map<string, Match[]> {
    const perStreamMatches = new Map<string, Match[]>();
    for (const match of matches) {
      if (match.streams.length === 0) {
        continue;
      }
      const preferredStream =
        this.streamSelector.findPreferredStream(match.streams, channelConfig) ||
        match.streams[0]!;

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
