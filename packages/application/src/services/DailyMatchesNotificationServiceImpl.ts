import type { DailyMatchesNotificationService } from "@dotabot.js/domain/service/DailyMatchesNotificationService";
import { inject, named } from "inversify";
import { Symbols } from "../di/Symbols";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";
import type { DailyMatchesMessenger } from "../messenger/DailyMatchesMessenger";
import {
  GetTournamentsWithMatchesTodayResultStatus,
  type TournamentService,
} from "@dotabot.js/domain/service/TournamentService";
import type { ChannelConfigurationRepository } from "@dotabot.js/domain/repository/ChannelConfigurationRepository";

export class DailyMatchesNotificationServiceImpl implements DailyMatchesNotificationService {
  constructor(
    @inject(Symbols.DailyMatchesMessenger)
    private readonly dailyMatchesMessenger: DailyMatchesMessenger,
    @inject(SharedSymbols.ChannelConfigurationRepository)
    @named("cached")
    private readonly channelConfigRepo: ChannelConfigurationRepository,
    @inject(SharedSymbols.TournamentService)
    private readonly tournamentService: TournamentService,
  ) {}

  async notify(channelId: bigint): Promise<void> {
    const channelConfig =
      await this.channelConfigRepo.getByChannelId(channelId);
    if (!channelConfig) {
      console.error("Channel config has been deleted, but notification hasn't");
      return;
    }

    // Pull back tournaments first
    const result =
      await this.tournamentService.getTournamentsWithMatchesToday(channelId);
    if (result.status === GetTournamentsWithMatchesTodayResultStatus.Success) {
      this.dailyMatchesMessenger.sendDailyMatches(channelConfig, result.data);
    }
  }
}
