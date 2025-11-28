import z from "zod";
import { WinnerType } from "../common/WinnerType";
import { camelCase } from "change-case/keys";

export const BaseSerieSchema = z.looseObject({
  beginAt: z.iso.datetime().nullable(),
  endAt: z.iso.datetime().nullable(),
  fullName: z.string(),
  id: z.int().gte(1),
  leagueId: z.int().gte(1),
  modifiedAt: z.iso.datetime(),
  name: z.string().nullable(),
  season: z.string().nullable(),
  slug: z.string().min(1),
  // TODO: winner_id
  winnerType: WinnerType.nullable(),
  year: z.int().gte(2012).nullable(),
});

export const BaseSerie = z.preprocess(
  (data: object) => camelCase(data),
  BaseSerieSchema,
);
export type BaseSerie = z.infer<typeof BaseSerie>;
