import type { DailyMatchesNotificationService } from "@dotabot.js/domain/service/DailyMatchesNotificationService";
import { Env } from "@dotabot.js/shared/Env";
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
          host: Env.getString("NOTIFICATION_DATABASE_HOST"),
          port: Env.getNumber("NOTIFICATION_DATABASE_PORT"),
        },
      },
    );

    this.worker.on("error", (err) => {
      console.error(err);
    });
  }
}
