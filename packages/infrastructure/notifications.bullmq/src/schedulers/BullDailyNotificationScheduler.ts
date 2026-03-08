import type { DailyNotificationScheduler } from "@dotabot.js/domain/notification/DailyNotificationScheduler";
import type { DailyMatchesNotificationService } from "@dotabot.js/domain/service/DailyMatchesNotificationService";
import { TimeOnly } from "@dotabot.js/domain/TimeOnly";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { Queue } from "bullmq";
import { inject, injectable } from "inversify";
import { DailyNotificationWorker } from "./workers/DailyNotificationWorker";

@injectable()
export class BullDailyNotificationScheduler implements DailyNotificationScheduler {
  private readonly queue: Queue;
  private readonly worker: DailyNotificationWorker;

  constructor(
    @inject(Symbols.DailyMatchesNotificationService)
    notificationsService: DailyMatchesNotificationService,
  ) {
    this.queue = new Queue("daily_notifications", {
      connection: {
        host: "localhost",
        port: 6379,
      },
    });

    this.worker = new DailyNotificationWorker(notificationsService);
  }

  schedule(channelId: BigInt, time: TimeOnly): void {
    console.log(`Scheduling notification for ${channelId} at ${time}`);
    this.queue.add(
      `daily-notification-${channelId}`,
      { channelId: channelId.toString() },
      {
        delay: 10000,
        repeat: {
          every: 24 * 60 * 60 * 1000,
        },
      },
    );
  }
}
