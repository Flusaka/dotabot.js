import type { DateTime } from "luxon";
import type { Entity } from "../../common/Entity";
import type { Opponent } from "./Opponent";

export class Match implements Entity {
  private _id: number;
  private _scheduledAt: DateTime;
  private _opponents: Opponent[];

  constructor(id: number, scheduledAt: DateTime, opponents: Opponent[]) {
    this._id = id;
    this._scheduledAt = scheduledAt;
    this._opponents = opponents;
  }

  get id() {
    return this._id;
  }

  get scheduledAt() {
    return this._scheduledAt;
  }

  get opponents() {
    return this._opponents;
  }
}
