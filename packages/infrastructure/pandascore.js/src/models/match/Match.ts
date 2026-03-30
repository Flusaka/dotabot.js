import z from "zod";
import { BaseMatchSchema } from "./BaseMatch";
import { BaseLeague } from "../league/BaseLeague";
import { BaseTeam } from "../team/BaseTeam";
import { BasePlayer } from "../player/BasePlayer";
import { BaseTournament } from "../tournament/BaseTournament";
import { BaseSerie } from "../serie/BaseSerie";
import { camelCase } from "change-case/keys";

const Opponent = z.discriminatedUnion("type", [
  z.object({ type: z.literal("Team"), opponent: BaseTeam }),
  z.object({ type: z.literal("Player"), opponent: BasePlayer }),
]);

const Game = z.preprocess(
  (data: object) => camelCase(data),
  z.looseObject({
    beginAt: z.iso.datetime().nullable(),
    complete: z.boolean(),
    detailedStats: z.boolean(),
    endAt: z.iso.datetime().nullable(),
    finished: z.boolean(),
    forfeit: z.boolean(),
    id: z.number().gte(1),
    length: z.number().gte(0).nullable(),
    matchId: z.number().gte(1),
    position: z.number().gte(1),
    status: z.enum(["finished", "not_played", "not_started", "running"]),
    // TODO: winner
    // TODO: winner_type
  }),
);

export const MatchSchema = BaseMatchSchema.extend({
  games: z.array(Game),
  league: BaseLeague,
  opponents: z.array(Opponent),
  serie: BaseSerie,
  tournament: BaseTournament,
  // TODO: winner
});

export const Match = z.preprocess(
  (data: object) => camelCase(data),
  MatchSchema,
);

export type Opponent = z.infer<typeof Opponent>;
export type Game = z.infer<typeof Game>;
export type Match = z.infer<typeof Match>;
