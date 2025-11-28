export enum Timezone {
  GMT,
  EET,
}

export function timezoneToString(timezone: Timezone) {
  switch (timezone) {
    case Timezone.EET:
      return "EET";
    case Timezone.GMT:
    default:
      return "GMT";
  }
}
