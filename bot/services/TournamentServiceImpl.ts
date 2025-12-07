import { inject, injectable } from "inversify";
import type { Tournament } from "../domain/data/Tournament";
import { Result } from "./common/Result";
import { GetTournamentsWithMatchesTodayResult } from "./interfaces/TournamentService";
import { Types } from "../di/Types";
import type { TournamentRepository } from "../repositories/interfaces/TournamentRepository";
import { DateTime } from "luxon";
import { Tier } from "../domain/common/Tier";
import type { ChannelConfigurationRepository } from "../repositories/interfaces/ChannelConfigurationRepository";

@injectable()
export class TournamentServiceImpl {
  constructor(
    @inject(Types.TournamentRepository)
    private tournamentRepository: TournamentRepository,
    @inject(Types.ChannelConfigurationRepository)
    private channelConfigRepository: ChannelConfigurationRepository,
  ) {}

  async getTournamentsWithMatchesToday(
    channelId: bigint,
  ): Promise<Result<GetTournamentsWithMatchesTodayResult, Tournament[]>> {
    const channel = this.channelConfigRepository.getByChannelId(channelId);

    if (!channel) {
      return new Result(
        GetTournamentsWithMatchesTodayResult.ChannelNotConnected,
      );
    }

    const tournaments =
      await this.tournamentRepository.getTournamentsWithMatches({
        earliestMatchStartTime: DateTime.now().startOf("day"),
        latestMatchStartTime: DateTime.now().endOf("day"),
        tiers: [Tier.S, Tier.A, Tier.B, Tier.C, Tier.D],
      });

    if (tournaments.length === 0) {
      return new Result(GetTournamentsWithMatchesTodayResult.NoMatchesToday);
    }

    return Promise.resolve(
      new Result(GetTournamentsWithMatchesTodayResult.Success, tournaments),
    );
  }
}
