export class Result<TEnum, TData> {
  private _result: TEnum;
  private _data?: TData;

  constructor(result: TEnum, data?: TData) {
    this._result = result;
    this._data = data;
  }

  get result() {
    return this._result;
  }

  get data() {
    return this._data;
  }
}
