import type { DailyNotificationScheduler } from "@dotabot.js/domain/notification/DailyNotificationScheduler";
import type { DailyMatchesNotificationService } from "@dotabot.js/domain/service/DailyMatchesNotificationService";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";
import { Queue } from "bullmq";
import { inject, injectable } from "inversify";
import { DailyNotificationWorker } from "./workers/DailyNotificationWorker";
import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import { toISOTimezone } from "@dotabot.js/domain/Timezone";
import { Symbols } from "../di/symbols";
import type { RedisOptions } from "ioredis";

@injectable()
export class BullDailyNotificationScheduler implements DailyNotificationScheduler {
  private readonly queue: Queue;
  // private readonly worker: DailyNotificationWorker;

  constructor(
    @inject(SharedSymbols.DailyMatchesNotificationService)
    notificationsService: DailyMatchesNotificationService,
    @inject(Symbols.RedisOptions)
    redisOptions: RedisOptions,
  ) {
    this.queue = new Queue("daily_notifications", {
      connection: redisOptions,
    });

    new DailyNotificationWorker(notificationsService, redisOptions);
  }

  async schedule(channelConfig: ChannelConfiguration): Promise<void> {
    if (!channelConfig.dailyNotificationsEnabled) {
      throw new Error("Daily notifications are not enabled!");
    }

    console.log(
      `Scheduling daily notifications for channel ${channelConfig.channelId} at ${channelConfig.dailyNotificationTime!} ${channelConfig.timezone}`,
    );

    const jobId = this.buildJobId(channelConfig.channelId);
    const { minutes, hours } = channelConfig.dailyNotificationTime!;
    await this.queue.upsertJobScheduler(
      jobId,
      {
        pattern: `${minutes} ${hours} * * *`,
        tz: toISOTimezone(channelConfig.timezone),
      },
      {
        name: jobId,
        data: { channelId: channelConfig.channelId.toString() },
      },
    );
  }

  async unschedule(channelId: bigint): Promise<void> {
    const jobId = this.buildJobId(channelId);
    await this.queue.removeJobScheduler(jobId);
  }

  private buildJobId = (channelId: bigint) => `daily-notification-${channelId}`;
}
