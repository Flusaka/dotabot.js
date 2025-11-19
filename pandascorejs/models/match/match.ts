import z from "zod";
import camelcaseKeys from "camelcase-keys";
import { BaseMatchSchema } from "./base-match";
import { BaseLeague } from "../league/base-league";
import { BaseTeam } from "../team/base-team";
import { BasePlayer } from "../player/base-player";

const Opponent = z.discriminatedUnion('type', [
    z.object({ type: z.literal('Team'), opponent: BaseTeam }),
    z.object({ type: z.literal('Player'), opponent: BasePlayer })
])

export const MatchSchema = BaseMatchSchema.extend({
    league: BaseLeague,
    opponents: z.array(Opponent)
});

export const Match = z.preprocess(
    (data: object) => camelcaseKeys(data),
    MatchSchema
);

export type Opponent = z.infer<typeof Opponent>;
export type Match = z.infer<typeof Match>;
