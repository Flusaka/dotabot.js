import type { ZodType } from "zod";
import type { SerialisationMethod } from "../serialisation/Serialiser";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestParameter {
  key: string;
  value: unknown;
  serialisationMethod?: SerialisationMethod;
}

export interface CreateRequestParameters<TResponse> {
  path: string;
  method: HttpMethod;
  headers: Map<string, RequestParameter>;
  query: Map<string, RequestParameter>;
  responseSchema: ZodType<TResponse>;
}
