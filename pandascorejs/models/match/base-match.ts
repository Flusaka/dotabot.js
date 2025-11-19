import camelcaseKeys from "camelcase-keys";
import z from "zod";

const MatchType = z.enum(['all_games_played', 'best_of', 'custom', 'first_to', 'ow_best_of', 'red_bull_home_ground']);
const MatchStatus = z.enum(['canceled', 'finished', 'not_started', 'postponed', 'running']);

export const BaseMatchSchema = z.looseObject({
    beginAt: z.iso.datetime().nullable(),
    detailedStats: z.boolean(),
    draw: z.boolean(),
    endAt: z.iso.datetime().nullable(),
    forfeit: z.boolean(),
    gameAdvantage: z.int().gte(1).nullable(),
    id: z.number().gte(1),
    // TODO: live
    matchType: MatchType,
    modifiedAt: z.iso.datetime(),
    name: z.string(),
    numberOfGames: z.int().gte(0),
    originalScheduledAt: z.iso.datetime().nullable(),
    rescheduled: z.boolean().nullable(),
    scheduledAt: z.iso.datetime().nullable(),
    slug: z.string().nullable(),
    status: MatchStatus,
    tournamentId: z.int().gte(1),
    // TODO: winner_id
    // TODO: winner_type 
});

export const BaseMatch = z.preprocess(
    (data: object) => camelcaseKeys(data),
    BaseMatchSchema
);

export type BaseMatch = z.infer<typeof BaseMatch>;
