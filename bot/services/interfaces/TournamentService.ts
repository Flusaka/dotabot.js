import type { Tournament } from "../../domain/data/Tournament";
import type { Result } from "../common/Result";

export enum GetTournamentsWithMatchesTodayResult {
  Success = 0,
  ChannelNotConnected,
  NoMatchesToday,
}

export interface TournamentService {
  getTournamentsWithMatchesToday(
    channelId: bigint,
  ): Promise<Result<GetTournamentsWithMatchesTodayResult, Tournament[]>>;
}
