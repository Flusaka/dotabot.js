import z from "zod";
import { camelCase } from "change-case/keys";

export const BaseLeagueSchema = z.looseObject({
  id: z.int().gte(1),
  imageUrl: z.url().nullable(),
  modifiedAt: z.iso.datetime(),
  name: z.string(),
  slug: z.string().min(1),
  url: z.string().nullable(),
});

export const BaseLeague = z.preprocess(
  (data: object) => camelCase(data),
  BaseLeagueSchema,
);
export type BaseLeague = z.infer<typeof BaseLeague>;
