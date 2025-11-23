import z from "zod";
import { Region } from "../common/Region";
import { Tier } from "../common/Tier";
import { WinnerType } from "../common/WinnerType";
import { camelCase } from "change-case/keys";

const TournamentType = z.enum(['offline', 'online', 'online/offline']);

export const BaseTournamentSchema = z.looseObject({
    beginAt: z.iso.datetime().nullable(),
    country: z.string().nullable(),
    detailedStats: z.boolean(),
    endAt: z.iso.datetime().nullable(),
    hasBracket: z.boolean(),
    id: z.int().gte(1),
    leagueId: z.int().gte(1),
    liveSupported: z.boolean(),
    modifiedAt: z.iso.datetime(),
    name: z.string(),
    prizepool: z.string().nullable(),
    region: Region.nullable(),
    serieId: z.int(),
    slug: z.string().min(1),
    tier: Tier.nullable(),
    type: TournamentType.nullable(),
    // TODO: winnerId
    winnerType: WinnerType.nullable()
});

export const BaseTournament = z.preprocess((data: object) => camelCase(data), BaseTournamentSchema);
export type BaseTournament = z.infer<typeof BaseTournament>;