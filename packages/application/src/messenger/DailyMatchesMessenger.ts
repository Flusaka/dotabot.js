import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { Tournament } from "@dotabot.js/domain/data/Tournament";

export interface DailyMatchesMessenger {
  sendDailyMatches(
    channelConfig: ChannelConfiguration,
    tournaments: Tournament[],
  ): Promise<void>;
}
