import type { DailyNotificationScheduler } from "@dotabot.js/domain/notification/DailyNotificationScheduler";
import type { DailyMatchesNotificationService } from "@dotabot.js/domain/service/DailyMatchesNotificationService";
import { TimeOnly } from "@dotabot.js/domain/TimeOnly";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { Queue } from "bullmq";
import { inject, injectable } from "inversify";
import { DailyNotificationWorker } from "./workers/DailyNotificationWorker";
import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import { toISOTimezone } from "@dotabot.js/domain/Timezone";

@injectable()
export class BullDailyNotificationScheduler implements DailyNotificationScheduler {
  private readonly queue: Queue;
  private readonly worker: DailyNotificationWorker;

  constructor(
    @inject(Symbols.DailyMatchesNotificationService)
    notificationsService: DailyMatchesNotificationService,
  ) {
    this.queue = new Queue("daily_notifications", {
      // TODO: Get connection from env
      connection: {
        host: "localhost",
        port: 6379,
      },
    });

    this.worker = new DailyNotificationWorker(notificationsService);
  }

  async schedule(channelConfig: ChannelConfiguration): Promise<void> {
    if (!channelConfig.dailyNotificationsEnabled) {
      throw new Error("Daily notifications are not enabled!");
    }

    const jobId = this.buildJobId(channelConfig.channelId);
    const { minutes, hours } = channelConfig.dailyNotificationTime!;
    console.log(
      `Scheduling notification for ${jobId} at ${channelConfig.dailyNotificationTime} in timezone ${toISOTimezone(channelConfig.timezone)}`,
    );
    // TODO: Manage timezones, either here or in app layer
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
    // Remove it from the queue but also from the worker
    const jobId = this.buildJobId(channelId);
    await this.queue.removeJobScheduler(jobId);
  }

  private buildJobId = (channelId: bigint) => `daily-notification-${channelId}`;
}
