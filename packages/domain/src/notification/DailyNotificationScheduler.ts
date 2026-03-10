import type { ChannelConfiguration } from "../ChannelConfiguration";
import type { TimeOnly } from "../TimeOnly";
import type { Timezone } from "../Timezone";

export interface DailyNotificationScheduler {
  schedule(channelConfig: ChannelConfiguration): Promise<void>;
  unschedule(channelId: bigint): Promise<void>;
}
