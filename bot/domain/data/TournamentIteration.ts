import type { Entity } from "../../common/Entity";
import type { TournamentPhase } from "./TournamentPhase";

export class TournamentIteration implements Entity {
  private _id: number;
  private _name: string;
  private _phases: TournamentPhase[];

  constructor(id: number, name: string, phases: TournamentPhase[]) {
    this._id = id;
    this._name = name;
    this._phases = phases;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get phases() {
    return this._phases;
  }
}
