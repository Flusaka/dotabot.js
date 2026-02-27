export class Opponent {
  private _id: number;
  private _name: string;

  constructor(id: number, name: string) {
    this._id = id;
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
}
