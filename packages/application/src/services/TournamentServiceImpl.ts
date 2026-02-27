import { Result, ResultWithData } from "@dotabot.js/domain/common/Result";
import type { ChannelConfigurationRepository } from "@dotabot.js/domain/repository/ChannelConfigurationRepository";
import type { TournamentRepository } from "@dotabot.js/domain/repository/TournamentRepository";
import {
  type TournamentService,
  type GetTournamentsWithMatchesTodayResult,
  GetTournamentsWithMatchesTodayResultStatus,
} from "@dotabot.js/domain/service/TournamentService";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { inject, injectable, named } from "inversify";
import { DateTime } from "luxon";

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
  ): Promise<GetTournamentsWithMatchesTodayResult> {
    const channel =
      await this.channelConfigRepository.getByChannelId(channelId);

    if (!channel) {
      return new Result(
        GetTournamentsWithMatchesTodayResultStatus.ChannelNotConnected,
      );
    }

    const tournaments =
      await this.tournamentRepository.getTournamentsWithMatches({
        earliestMatchStartTime: DateTime.now().startOf("day"),
        latestMatchStartTime: DateTime.now().endOf("day"),
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
