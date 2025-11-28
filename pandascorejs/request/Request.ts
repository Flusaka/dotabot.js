import type { ZodType } from "zod";
import type {
  CreateRequestParameters,
  HttpMethod,
  RequestParameter,
} from "./types";
import { QuerySerialiser } from "../serialisation/QuerySerialiser";
import { HeaderSerialiser } from "../serialisation/HeaderSerialiser";

export class Request<TResponse> {
  private readonly baseUrl: string = "https://api.pandascore.co";

  private method: HttpMethod;
  private path: string;
  private headers: Map<string, RequestParameter>;
  private query: Map<string, RequestParameter>;
  private responseSchema: ZodType<TResponse>;

  constructor(params: CreateRequestParameters<TResponse>) {
    this.method = params.method;
    this.path = params.path;
    this.headers = params.headers;
    this.query = params.query;
    this.responseSchema = params.responseSchema;
  }

  buildHeaders(): Headers {
    return new HeaderSerialiser().serialise(this.headers);
  }

  buildRequestUrl(): string {
    const queryString = new QuerySerialiser().serialise(this.query);
    console.log(`Query string: ${queryString}`);
    return `${this.baseUrl}${this.path}${queryString}`;
  }

  async execute(): Promise<TResponse> {
    const endpoint = this.buildRequestUrl();
    const headers = this.buildHeaders();

    const response = await fetch(endpoint, {
      headers,
      method: this.method,
    });
    const json = await response.json();
    return this.responseSchema.parseAsync(json);
  }
}
