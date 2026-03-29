import z from "zod";
import { camelCase } from "change-case/keys";
import { ChangeType, IncidentType } from "./IncidentType";
import { BaseLeague } from "../league/BaseLeague";
import { BaseSerie } from "../serie/BaseSerie";
import { BaseTournament } from "../tournament/BaseTournament";
import { Match } from "../match/Match";
import { BasePlayer } from "../player/BasePlayer";
import { BaseTeam } from "../team/BaseTeam";

// #region Deletion incident schema
const DeletionIncidentObject = z.preprocess(
  (data: object) => camelCase(data),
  z.looseObject({
    deletedAt: z.string(),
  }),
);
type DeletionIncidentObject = z.infer<typeof DeletionIncidentObject>;

const DeletionIncidentSchema = z.looseObject({
  changeType: ChangeType.exclude(["creation", "update"]),
  id: z.number().gte(1),
  modifiedAt: z.iso.datetime(),
  object: DeletionIncidentObject,
  type: IncidentType,
});
type DeletionIncidentSchema = z.infer<typeof DeletionIncidentSchema>;

export const DeletionIncident = z.preprocess(
  (data: object) => camelCase(data),
  DeletionIncidentSchema,
);
export type DeletionIncident = z.infer<typeof DeletionIncident>;
// #endregion

// #region Non-deletion incident schema
export const NonDeletionIncidentObject = z.union([
  BaseLeague,
  BaseSerie,
  BaseTournament,
  Match,
  BasePlayer,
  BaseTeam,
]);
export type NonDeletionIncidentObject = z.infer<
  typeof NonDeletionIncidentObject
>;

const NonDeletionIncidentSchema = z.looseObject({
  changeType: ChangeType.exclude(["deletion"]),
  id: z.number().gte(1),
  modifiedAt: z.iso.datetime(),
  object: NonDeletionIncidentObject,
  type: IncidentType,
});
type NonDeletionIncidentSchema = z.infer<typeof NonDeletionIncidentSchema>;

export const NonDeletionIncident = z.preprocess(
  (data: object) => camelCase(data),
  NonDeletionIncidentSchema,
);
export type NonDeletionIncident = z.infer<typeof NonDeletionIncident>;
// #endregion

// #region Any incident type schema
export const Incident = z.preprocess(
  (data: object) => camelCase(data),
  z.discriminatedUnion("changeType", [
    DeletionIncidentSchema,
    NonDeletionIncidentSchema,
  ]),
);
export type Incident = z.infer<typeof Incident>;
// #endregion
