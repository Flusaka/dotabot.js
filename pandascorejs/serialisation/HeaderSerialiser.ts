import type { RequestParameter } from "../request/types";
import { Serialiser } from "./Serialiser";

export class HeaderSerialiser extends Serialiser {
  public serialise(headers: Map<string, RequestParameter>): Headers {
    const output = new Headers();
    headers.forEach((param) => {
      output.set(param.key, this.serialiseValue(param));
    });
    return output;
  }
}
