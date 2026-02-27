import z from "zod";
import { DateTimeRange } from "./Range";

export const MatchesRange = z.object({
  beginAt: DateTimeRange.optional(),
  scheduledAt: DateTimeRange.optional(),
});

export type MatchesRange = z.infer<typeof MatchesRange>;
