import type { DateTime } from "luxon";
import type { Tournament } from "../data/Tournament";
import type { Tier } from "../common/Tier";

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
