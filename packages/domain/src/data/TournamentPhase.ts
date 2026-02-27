import type { Entity } from "../common/Entity";
import type { Match } from "./Match";

export class TournamentPhase implements Entity {
  private _id: number;
  private _name: string;
  private _matches: Match[];

  constructor(id: number, name: string, matches: Match[]) {
    this._id = id;
    this._name = name;
    this._matches = matches;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get matches() {
    return this._matches;
  }
}
