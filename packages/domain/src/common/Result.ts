export class Result<TEnum> {
  private _status: TEnum;

  constructor(result: TEnum) {
    this._status = result;
  }

  get status() {
    return this._status;
  }
}

export class ResultWithData<TEnum, TData> extends Result<TEnum> {
  private _data: TData;

  constructor(status: TEnum, data: TData) {
    super(status);
    this._data = data;
  }

  get data() {
    return this._data;
  }
}
