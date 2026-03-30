import type { RequestParameter } from "../request/types";

export type SerialisationMethod = "simple" | "deep" | "form";

export abstract class Serialiser {
  protected serialiseValue(param: RequestParameter): string {
    if (Array.isArray(param.value)) {
      return this.serialiseArray(
        param.key,
        param.value,
        param.serialisationMethod,
      );
    }

    if (param.value instanceof Date) {
      return this.serialisePrimitive(
        param.key,
        param.value.toISOString(),
        param.serialisationMethod,
      );
    }

    if (typeof param.value === "object" && param.value !== null) {
      return this.serialiseObject(param.value, param);
    }

    return this.serialisePrimitive(
      param.key,
      `${param.value}`,
      param.serialisationMethod,
    );
  }

  private serialisePrimitive(
    key: string,
    value: string,
    serialisationMethod?: SerialisationMethod,
  ): string {
    switch (serialisationMethod) {
      case "form":
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
    return `${value}`;
  }

  private serialiseArray(
    key: string,
    value: unknown[],
    serialisationMethod?: SerialisationMethod,
  ): string {
    switch (serialisationMethod) {
      case "form":
        return `${encodeURIComponent(key)}=${encodeURIComponent(value.join(","))}`;
    }
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
