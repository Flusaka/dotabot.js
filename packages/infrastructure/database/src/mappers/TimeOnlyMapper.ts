import { TimeOnly } from "@dotabot.js/domain/TimeOnly";
import { DateTime } from "luxon";

export class TimeOnlyMapper {
  static toDomain(model: Date | null): TimeOnly | undefined {
    if (!model) {
      return;
    }

    return new TimeOnly(model.getHours(), model.getMinutes());
  }

  static toModel(domain?: TimeOnly) {
    if (!domain) {
      return null;
    }

    return DateTime.fromObject({
      minute: domain.minutes,
      hour: domain.hours,
    }).toJSDate();
  }
}
