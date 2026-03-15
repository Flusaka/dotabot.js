import { DateTime } from "luxon";

export class TimeParseError extends Error {
  constructor() {
    super("Time string is invalid");
    this.name = "TimeParseError";
  }
}

export class TimeOnly {
  hours: number;
  minutes: number;

  constructor(hours: number, minutes: number) {
    this.hours = hours;
    this.minutes = minutes;
  }

  toString(): string {
    return DateTime.fromObject({
      hour: this.hours,
      minute: this.minutes,
    }).toLocaleString(DateTime.TIME_24_SIMPLE);
  }

  static parse(timeString: string): TimeOnly {
    const result = DateTime.fromISO(timeString);
    if (!result.isValid) {
      throw new TimeParseError();
    }
    return new TimeOnly(result.hour, result.minute);
  }

  static get zero() {
    return new TimeOnly(0, 0);
  }
}
