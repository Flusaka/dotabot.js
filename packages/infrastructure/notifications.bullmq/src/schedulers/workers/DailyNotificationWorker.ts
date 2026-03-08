import type { DailyMatchesNotificationService } from "@dotabot.js/domain/service/DailyMatchesNotificationService";
import { Worker } from "bullmq";

export class DailyNotificationWorker {
  private worker: Worker;

  constructor(notificationsService: DailyMatchesNotificationService) {
    this.worker = new Worker(
      "daily_notifications",
      async (job) => {
        if (!job.data.channelId) {
          throw new Error("No channel ID specified");
        }
        const channelId = BigInt(job.data.channelId);
        notificationsService.notify(channelId);
      },
      {
        connection: {
          host: "localhost",
          port: 6379,
        },
      },
    );

    this.worker.on("error", (err) => {
      console.error(err);
    });
  }
}
