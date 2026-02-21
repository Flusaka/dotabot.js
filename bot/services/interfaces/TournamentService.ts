import type { Tournament } from "../../domain/data/Tournament";
import type { Result, ResultWithData } from "../common/Result";

export enum GetTournamentsWithMatchesTodayResultStatus {
  Success = 0,
  ChannelNotConnected,
  NoMatchesToday,
}

export type GetTournamentsWithMatchesTodayResult =
  | ResultWithData<
      GetTournamentsWithMatchesTodayResultStatus.Success,
      Tournament[]
    >
  | Result<
      | GetTournamentsWithMatchesTodayResultStatus.NoMatchesToday
      | GetTournamentsWithMatchesTodayResultStatus.ChannelNotConnected
    >;

export interface TournamentService {
  getTournamentsWithMatchesToday(
    channelId: bigint,
  ): Promise<GetTournamentsWithMatchesTodayResult>;
}
