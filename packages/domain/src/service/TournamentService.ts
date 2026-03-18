import type { Tournament } from "../data/Tournament";
import type { Result, ResultWithData } from "../common/Result";

export const StartTime = {
  Midnight: "Midnight",
  DailyNotificationTime: "DailyNotificationTime",
} as const;
export type StartTime = (typeof StartTime)[keyof typeof StartTime];

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
    startTime: StartTime,
  ): Promise<GetTournamentsWithMatchesTodayResult>;
}
