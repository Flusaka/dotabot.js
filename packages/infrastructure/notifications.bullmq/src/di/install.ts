import type { DailyNotificationScheduler } from "@dotabot.js/domain/notification/DailyNotificationScheduler";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";
import type { Container } from "inversify";
import { BullDailyNotificationScheduler } from "../schedulers/BullDailyNotificationScheduler";
import type { RedisOptions } from "ioredis";
import { Symbols } from "./symbols";
import { Env } from "@dotabot.js/shared/Env";

export function installScheduling(container: Container) {
  container
    .bind<DailyNotificationScheduler>(SharedSymbols.DailyNotificationScheduler)
    .to(BullDailyNotificationScheduler)
    .inSingletonScope();

  container
    .bind<RedisOptions>(Symbols.RedisOptions)
    .toResolvedValue(() => ({
      host: Env.getString("NOTIFICATION_DATABASE_HOST"),
      port: Env.getNumber("NOTIFICATION_DATABASE_PORT"),
    }))
    .inSingletonScope();
}
