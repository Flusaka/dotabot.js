import z from "zod";
import camelcaseKeys from "camelcase-keys";

export const BaseTeamSchema = z.looseObject({
    acronym: z.string().nullable(),
    darkModeImageUrl: z.url().nullable(),
    id: z.int().gte(1),
    imageUrl: z.string().nullable(),
    location: z.string().nullable(),
    modifiedAt: z.iso.datetime(),
    name: z.string(),
    slug: z.string().nullable()
});

export const BaseTeam = z.preprocess((data: object) => camelcaseKeys(data), BaseTeamSchema);
export type BaseTeam = z.infer<typeof BaseTeam>;