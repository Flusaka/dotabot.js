export const Timezone = {
  GMT: "GMT",
  EET: "EET",
} as const;

export type Timezone = (typeof Timezone)[keyof typeof Timezone];

export function timezoneToString(timezone: Timezone) {
  switch (timezone) {
    case Timezone.EET:
      return "EET";
    case Timezone.GMT:
    default:
      return "GMT";
  }
}
