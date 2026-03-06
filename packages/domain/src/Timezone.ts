export const Timezone = {
  GMT: "GMT",
  EET: "EET",
} as const;

export type Timezone = (typeof Timezone)[keyof typeof Timezone];

export function isTimezone(value: string): value is Timezone {
  return Object.values(Timezone).includes(value as Timezone);
}
