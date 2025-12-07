import type { DateTime } from "luxon";
import type { Tournament } from "../../domain/data/Tournament";
import type { Tier } from "../../domain/common/Tier";

export type TournamentsWithMatchesQuery = {
  earliestMatchStartTime: DateTime;
  latestMatchStartTime: DateTime;
  tiers: Tier[];
};

export interface TournamentRepository {
  getTournamentsWithMatches(
    query: TournamentsWithMatchesQuery,
  ): Promise<Tournament[]>;
}
