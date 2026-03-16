import type { DailyMatchesNotificationService } from "@dotabot.js/domain/service/DailyMatchesNotificationService";
import { Worker } from "bullmq";
import type { RedisOptions } from "ioredis";

export class DailyNotificationWorker {
  private worker: Worker;

  constructor(
    notificationsService: DailyMatchesNotificationService,
    redisOptions: RedisOptions,
  ) {
    this.worker = new Worker(
      "daily_notifications",
      async (job) => {
        console.log(`Attempting to run job DailyNotificationWorker:${job.id}`);
        if (!job.data.channelId) {
          throw new Error("No channel ID specified");
        }
        const channelId = BigInt(job.data.channelId);
        await notificationsService.notify(channelId);
      },
      {
        connection: redisOptions,
      },
    );

    this.worker.on("error", (err) => {
      console.error(err);
    });
  }
}
