import type { Entity } from "../common/Entity";
import type { TournamentIteration } from "./TournamentIteration";

export class Tournament implements Entity {
  private _id: number;
  private _name: string;
  private _iterations: TournamentIteration[];

  constructor(id: number, name: string, iterations: TournamentIteration[]) {
    this._id = id;
    this._name = name;
    this._iterations = iterations;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get iterations() {
    return this._iterations;
  }
}
