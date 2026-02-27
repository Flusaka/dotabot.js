import type { DateTime } from "luxon";
import type { Entity } from "../common/Entity";
import type { Opponent } from "./Opponent";
import type { Stream } from "./Stream";

export type MatchOpponent = Opponent | Opponent[] | undefined;

export class Match implements Entity {
  private _id: number;
  private _scheduledAt: DateTime;
  private _radiant: MatchOpponent;
  private _dire: MatchOpponent;
  private _streams: Stream[];

  constructor(
    id: number,
    scheduledAt: DateTime,
    radiant: MatchOpponent,
    dire: MatchOpponent,
    streams: Stream[],
  ) {
    this._id = id;
    this._scheduledAt = scheduledAt;
    this._radiant = radiant;
    this._dire = dire;
    this._streams = streams;
  }

  get id() {
    return this._id;
  }

  get scheduledAt() {
    return this._scheduledAt;
  }

  get radiant() {
    return this._radiant;
  }

  get dire() {
    return this._dire;
  }

  get streams() {
    return this._streams;
  }
}
