import type { RequestParameter } from "../request/types";

export type SerialisationMethod = "simple" | "deep";

export class Serialiser {
  protected serialiseValue(param: RequestParameter): string {
    if (Array.isArray(param.value)) {
      return this.serialiseArray(param.value, param);
    }

    if (typeof param.value === "object" && param.value !== null) {
      return this.serialiseObject(param.value, param);
    }

    return this.serialisePrimitive(param);
  }

  private serialisePrimitive(param: RequestParameter): string {
    return `${param.value}`;
  }

  private serialiseArray(value: unknown[], param: RequestParameter): string {
    return `${value.join(",")}`;
  }

  private serialiseObject(obj: object, param: RequestParameter): string {
    switch (param.serialisationMethod) {
      case "simple":
        return Object.entries(obj)
          .map(([key, val]) => `${key},${val}`)
          .join(",");
      case "deep":
      default:
        return Object.entries(obj)
          .map(([key, val]) => `${param.key}[${key}]=${val}`)
          .join("&");
    }
  }
}
