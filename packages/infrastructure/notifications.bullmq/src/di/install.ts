import type { DailyNotificationScheduler } from "@dotabot.js/domain/notification/DailyNotificationScheduler";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";
import type { Container } from "inversify";
import { BullDailyNotificationScheduler } from "../schedulers/BullDailyNotificationScheduler";

export function installScheduling(container: Container) {
  container
    .bind<DailyNotificationScheduler>(SharedSymbols.DailyNotificationScheduler)
    .to(BullDailyNotificationScheduler)
    .inSingletonScope();
}
