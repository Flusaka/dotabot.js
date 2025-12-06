import type { ZodType } from "zod";
import type {
  CreateRequestParameters,
  HttpMethod,
  RequestParameter,
} from "./types";
import { QuerySerialiser } from "../serialisation/QuerySerialiser";
import { HeaderSerialiser } from "../serialisation/HeaderSerialiser";

export type PageResponse = {
  page: number;
  perPage: number;
  total: number;

  firstPage: string;
  previousPage: string;
  nextPage: string;
  lastPage: string;
};

export class Response<TResponseBody> {
  content: TResponseBody;
  page?: PageResponse;

  constructor(content: TResponseBody, page?: PageResponse) {
    this.content = content;
    this.page = page;
  }

  get hasMore() {
    if (!this.page) {
      return false;
    }

    return this.page.page * this.page.perPage < this.page.total;
  }

  get totalPages() {
    if (!this.page) {
      return 1;
    }

    return Math.round(this.page.total / this.page.perPage);
  }

  static async fromFetchResponse<TResponseBody>(
    response: globalThis.Response,
    bodySchema: ZodType<TResponseBody>,
  ): Promise<Response<TResponseBody>> {
    const json = await response.json();
    const content = await bodySchema.parseAsync(json);

    // Retrieve page headers
    if (
      response.headers.has("X-Page") &&
      response.headers.has("X-Per-Page") &&
      response.headers.has("X-Total")
    ) {
      const page = parseInt(response.headers.get("X-Page")!);
      const perPage = parseInt(response.headers.get("X-Per-Page")!);
      const total = parseInt(response.headers.get("X-Total")!);

      return new Response<TResponseBody>(content, {
        page,
        perPage,
        total,
        firstPage: "",
        previousPage: "",
        nextPage: "",
        lastPage: "",
      });
    }

    return new Response<TResponseBody>(content);
  }
}

export class Request<TResponseBody> {
  private readonly baseUrl: string = "https://api.pandascore.co";

  private method: HttpMethod;
  private path: string;
  private headers: Map<string, RequestParameter>;
  private query: Map<string, RequestParameter>;
  private responseSchema: ZodType<TResponseBody>;

  constructor(params: CreateRequestParameters<TResponseBody>) {
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

  async execute(): Promise<Response<TResponseBody>> {
    const endpoint = this.buildRequestUrl();
    const headers = this.buildHeaders();

    const response = await fetch(endpoint, {
      headers,
      method: this.method,
    });
    return await Response.fromFetchResponse<TResponseBody>(
      response,
      this.responseSchema,
    );
  }
}
