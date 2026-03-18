import { Result, ResultWithData } from "@dotabot.js/domain/common/Result";
import type { ChannelConfigurationRepository } from "@dotabot.js/domain/repository/ChannelConfigurationRepository";
import type { TournamentRepository } from "@dotabot.js/domain/repository/TournamentRepository";
import {
  type TournamentService,
  type GetTournamentsWithMatchesTodayResult,
  GetTournamentsWithMatchesTodayResultStatus,
  StartTime,
} from "@dotabot.js/domain/service/TournamentService";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { inject, injectable, named } from "inversify";
import { DateTime, IANAZone } from "luxon";

@injectable()
export class TournamentServiceImpl implements TournamentService {
  constructor(
    @inject(Symbols.TournamentRepository)
    private tournamentRepository: TournamentRepository,
    @inject(Symbols.ChannelConfigurationRepository)
    @named("cached")
    private channelConfigRepository: ChannelConfigurationRepository,
  ) {}

  async getTournamentsWithMatchesToday(
    channelId: bigint,
    startTime: StartTime,
  ): Promise<GetTournamentsWithMatchesTodayResult> {
    const channel =
      await this.channelConfigRepository.getByChannelId(channelId);

    if (!channel) {
      return new Result(
        GetTournamentsWithMatchesTodayResultStatus.ChannelNotConnected,
      );
    }

    const zone = IANAZone.create(channel.timezone);
    let earliestMatchStartTime: DateTime = DateTime.local({
      zone,
    });

    switch (startTime) {
      case "Midnight":
        earliestMatchStartTime = earliestMatchStartTime.startOf("day");
        break;
      case "DailyNotificationTime":
        if (!channel.dailyNotificationsEnabled) {
          throw new Error(
            "Daily notifications are not enabled for this channel! Matches cannot be retrieved from daily notification time.",
          );
        }
        earliestMatchStartTime = DateTime.fromObject(
          {
            hour: channel.dailyNotificationTime!.hours,
            minute: channel.dailyNotificationTime!.minutes,
          },
          { zone },
        );
        break;
    }

    const tournaments =
      await this.tournamentRepository.getTournamentsWithMatches({
        earliestMatchStartTime: earliestMatchStartTime.toUTC(),
        latestMatchStartTime: earliestMatchStartTime
          .plus({ days: 1 })
          .minus({ seconds: 1 })
          .toUTC(),
        tiers: channel.tiers,
      });

    if (tournaments.length === 0) {
      return new Result(
        GetTournamentsWithMatchesTodayResultStatus.NoMatchesToday,
      );
    }

    return new ResultWithData(
      GetTournamentsWithMatchesTodayResultStatus.Success,
      tournaments,
    );
  }
}
