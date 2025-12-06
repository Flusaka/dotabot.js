import z from "zod";
import { Match } from "../models/match/Match";
import { MatchesRange } from "../ranges/common/MatchesRange";
import { RequestBuilder } from "../request/RequestBuilder";
import type { Response } from "../request/Request";
import type { Page } from "../page/Page";

export interface GetMatchesRequestParams {
  range?: MatchesRange;
  page?: Page;
}

export class MatchesClient {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getDota2Matches(
    requestParams?: GetMatchesRequestParams,
  ): Promise<Response<Match[]>> {
    const request = new RequestBuilder<Match[]>()
      .setPath("/dota2/matches")
      .setResponseSchema(z.array(Match))
      .addQueryParam({
        key: "range",
        value: requestParams?.range,
        serialisationMethod: "deep",
      })
      .addQueryParam({
        key: "page",
        value: requestParams?.page,
        serialisationMethod: "deep",
      })
      .addHeader({
        key: "Authorization",
        value: `Bearer ${this.token}`,
      })
      .build();

    return request.execute();
  }
}
