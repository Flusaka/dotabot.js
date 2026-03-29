import z from "zod";

export const ChangeType = z.enum(["creation", "update", "deletion"]);
export type ChangeType = z.infer<typeof ChangeType>;

export const IncidentType = z.enum([
  "league",
  "match",
  "player",
  "serie",
  "team",
  "tournament",
]);
export type IncidentType = z.infer<typeof IncidentType>;
