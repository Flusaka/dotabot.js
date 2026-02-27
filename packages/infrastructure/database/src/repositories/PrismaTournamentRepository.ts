import { Match } from "@dotabot.js/domain/data/Match";
import { Opponent } from "@dotabot.js/domain/data/Opponent";
import { Tournament } from "@dotabot.js/domain/data/Tournament";
import { TournamentIteration } from "@dotabot.js/domain/data/TournamentIteration";
import { TournamentPhase } from "@dotabot.js/domain/data/TournamentPhase";
import type {
  TournamentRepository,
  TournamentsWithMatchesQuery,
} from "@dotabot.js/domain/repository/TournamentRepository";
import { injectable } from "inversify";
import { StreamMapper } from "../mappers/StreamMapper";
import { TierMapper } from "../mappers/TierMapper";
import { DateTime } from "luxon";
import prisma from "../prisma";

@injectable()
export class PrismaTournamentRepository implements TournamentRepository {
  async getTournamentsWithMatches(
    query: TournamentsWithMatchesQuery,
  ): Promise<Tournament[]> {
    const tiers = query.tiers.map(TierMapper.toModel);
    const earliestMatchStartTime = query.earliestMatchStartTime.toJSDate();
    const latestMatchStartTime = query.latestMatchStartTime.toJSDate();
    const tournaments = await prisma.tournament.findMany({
      where: {
        tournamentIterations: {
          some: {
            tournamentPhases: {
              some: {
                tier: {
                  in: tiers,
                },
                matches: {
                  some: {
                    scheduledAt: {
                      gte: earliestMatchStartTime,
                      lte: latestMatchStartTime,
                    },
                  },
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        tournamentIterations: {
          select: {
            id: true,
            name: true,
            tournamentPhases: {
              select: {
                id: true,
                name: true,
                matches: {
                  select: {
                    id: true,
                    scheduledAt: true,
                    radiantTeam: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    direTeam: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    streams: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const mapped = tournaments
      .map(
        (tournament) =>
          new Tournament(
            tournament.id,
            tournament.name,
            tournament.tournamentIterations.map(
              (iteration) =>
                new TournamentIteration(
                  iteration.id,
                  iteration.name,
                  iteration.tournamentPhases.map(
                    (phase) =>
                      new TournamentPhase(
                        phase.id,
                        phase.name,
                        phase.matches
                          .filter(
                            (match) =>
                              earliestMatchStartTime <= match.scheduledAt! &&
                              latestMatchStartTime >= match.scheduledAt!,
                          )
                          .map(
                            (match) =>
                              new Match(
                                match.id,
                                DateTime.fromJSDate(match.scheduledAt!),
                                match.radiantTeam
                                  ? new Opponent(
                                      match.radiantTeam.id,
                                      match.radiantTeam.name,
                                    )
                                  : undefined,
                                match.direTeam
                                  ? new Opponent(
                                      match.direTeam.id,
                                      match.direTeam.name,
                                    )
                                  : undefined,
                                StreamMapper.toDomain(match.streams),
                              ),
                          )
                          .sort((matchA, matchB) =>
                            matchA.scheduledAt < matchB.scheduledAt ? 1 : -1,
                          ),
                      ),
                  ),
                ),
            ),
          ),
      )
      .filter((tournament) =>
        tournament.iterations.some((iteration) =>
          iteration.phases.some((phase) => phase.matches.length > 0),
        ),
      );

    return mapped;
  }
}
