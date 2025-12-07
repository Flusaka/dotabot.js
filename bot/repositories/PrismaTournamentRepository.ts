import { inject, injectable } from "inversify";
import type {
  TournamentRepository,
  TournamentsWithMatchesQuery,
} from "./interfaces/TournamentRepository";
import { Tournament } from "../domain/data/Tournament";
import { Types } from "../di/Types";
import type { PrismaClient } from "../../generated/prisma/client";
import { TierMapper } from "../mappers/TierMapper";
import { TournamentIteration } from "../domain/data/TournamentIteration";
import { TournamentPhase } from "../domain/data/TournamentPhase";
import { Match } from "../domain/data/Match";
import { DateTime } from "luxon";
import { Opponent } from "../domain/data/Opponent";

@injectable()
export class PrismaTournamentRepository implements TournamentRepository {
  constructor(@inject(Types.PrismaClient) private prisma: PrismaClient) {}

  async getTournamentsWithMatches(
    query: TournamentsWithMatchesQuery,
  ): Promise<Tournament[]> {
    const tiers = query.tiers.map(TierMapper.toModel);
    const earliestMatchStartTime = query.earliestMatchStartTime.toJSDate();
    const latestMatchStartTime = query.latestMatchStartTime.toJSDate();
    const tournaments = await this.prisma.tournament.findMany({
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
                                [
                                  match.radiantTeam
                                    ? new Opponent(
                                        match.radiantTeam.id,
                                        match.radiantTeam.name,
                                      )
                                    : Opponent.empty(),
                                  match.direTeam
                                    ? new Opponent(
                                        match.direTeam.id,
                                        match.direTeam.name,
                                      )
                                    : Opponent.empty(),
                                ],
                              ),
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
