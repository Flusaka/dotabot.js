import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { Tournament } from "@dotabot.js/domain/data/Tournament";

export interface DailyMatchesMessenger {
  sendDailyMatches(
    channel: ChannelConfiguration,
    tournaments: Tournament[],
  ): void;
}
