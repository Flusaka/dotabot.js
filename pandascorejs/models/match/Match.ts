import z from "zod";
import { BaseMatchSchema } from "./BaseMatch";
import { BaseLeague } from "../league/BaseLeague";
import { BaseTeam } from "../team/BaseTeam";
import { BasePlayer } from "../player/BasePlayer";
import { BaseTournament } from "../tournament/BaseTournament";
import { BaseSerie } from "../serie/BaseSerie";
import { camelCase } from "change-case/keys";

const Opponent = z.discriminatedUnion('type', [
    z.object({ type: z.literal('Team'), opponent: BaseTeam }),
    z.object({ type: z.literal('Player'), opponent: BasePlayer })
]);

export const MatchSchema = BaseMatchSchema.extend({
    league: BaseLeague,
    opponents: z.array(Opponent),
    serie: BaseSerie,
    tournament: BaseTournament
    // TODO: winner
});

export const Match = z.preprocess(
    (data: object) => camelCase(data),
    MatchSchema
);

export type Opponent = z.infer<typeof Opponent>;
export type MatchResponse = z.input<typeof Match>;
export type Match = z.infer<typeof Match>;
