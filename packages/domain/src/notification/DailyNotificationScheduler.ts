import type { TimeOnly } from "../TimeOnly";

export interface DailyNotificationScheduler {
  schedule(channelId: BigInt, time: TimeOnly): void;
}
