import z from "zod";

export const MatchesRange = z.looseObject({
    beginAt: z.array(z.iso.datetime()).min(2).max(2),
    scheduledAt: z.array(z.iso.datetime()).min(2).max(2)
});

export type MatchesRange = z.infer<typeof MatchesRange>;