export const Tier = {
  S: "S",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  Unknown: "Unknown",
} as const;

export type Tier = (typeof Tier)[keyof typeof Tier];

export function isTier(value: string): value is Tier {
  return Object.values(Tier).includes(value as Tier);
}
