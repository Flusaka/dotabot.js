export const Tier = {
  S: "S",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  Unknown: "Unknown",
} as const;

export type Tier = (typeof Tier)[keyof typeof Tier];
