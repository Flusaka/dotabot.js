import type { DailyNotificationScheduler } from "@dotabot.js/domain/notification/DailyNotificationScheduler";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";
import type { Container } from "inversify";
import { BullDailyNotificationScheduler } from "../schedulers/BullDailyNotificationScheduler";
import { Redis } from "ioredis";
import { Symbols } from "./symbols";
import { Env } from "@dotabot.js/shared/Env";

export function installScheduling(container: Container) {
  container
    .bind<DailyNotificationScheduler>(SharedSymbols.DailyNotificationScheduler)
    .to(BullDailyNotificationScheduler)
    .inSingletonScope();

  container
    .bind<Redis>(Symbols.Redis)
    .toResolvedValue(
      () =>
        new Redis(Env.getString("NOTIFICATION_DATABASE_URL"), {
          maxRetriesPerRequest: null,
        }),
    )
    .inSingletonScope();
}
