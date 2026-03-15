import type { ChannelConfiguration } from "../ChannelConfiguration";

export interface DailyNotificationScheduler {
  schedule(channelConfig: ChannelConfiguration): Promise<void>;
  unschedule(channelId: bigint): Promise<void>;
}
