export const Timezone = {
  GMT: "GMT",
  EET: "EET",
} as const;

export const TimezoneISO = {
  GMT: "Europe/London",
  EET: "Europe/Helsinki",
} as const;

export type Timezone = (typeof Timezone)[keyof typeof Timezone];
export type TimezoneISO = (typeof TimezoneISO)[keyof typeof TimezoneISO];

export function isTimezone(value: string): value is Timezone {
  return Object.values(Timezone).includes(value as Timezone);
}

export function toISOTimezone(timezone: Timezone): TimezoneISO {
  return TimezoneISO[timezone];
}
