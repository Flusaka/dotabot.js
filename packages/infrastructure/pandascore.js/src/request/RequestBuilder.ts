import { z, type ZodType } from "zod";
import type { CreateRequestParameters, RequestParameter } from "./types";
import { Request } from "./Request";
import { snakeCase } from "change-case/keys";

export class RequestBuilder<TResponse> {
  private params: CreateRequestParameters<TResponse>;

  constructor() {
    this.params = {
      method: "GET",
      path: "",
      headers: new Map(),
      query: new Map(),
      responseSchema: z.any(),
    };
  }

  setPath(path: string): RequestBuilder<TResponse> {
    this.params.path = path;
    return this;
  }

  setResponseSchema(
    responseSchema: ZodType<TResponse>,
  ): RequestBuilder<TResponse> {
    this.params.responseSchema = responseSchema;
    return this;
  }

  addHeader(param: RequestParameter): RequestBuilder<TResponse> {
    this.params.headers.set(param.key, {
      key: param.key,
      value: param.value,
      serialisationMethod: param.serialisationMethod ?? "simple",
    });
    return this;
  }

  addQueryParam(param: Partial<RequestParameter>): RequestBuilder<TResponse> {
    if (!param.key || !param.value) {
      return this;
    }

    this.params.query.set(param.key, {
      key: param.key,
      value: snakeCase(param.value),
      serialisationMethod: param.serialisationMethod ?? "simple",
    });
    return this;
  }

  build(): Request<TResponse> {
    return new Request<TResponse>(this.params);
  }
}
