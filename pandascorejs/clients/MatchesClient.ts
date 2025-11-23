import z from "zod";
import { Match } from "../models/match/Match";
import { MatchesRange } from "../ranges/common/MatchesRange";
import { RequestBuilder } from "../request/RequestBuilder";

export interface GetMatchesRequestParams {
    range?: MatchesRange;
}

export class MatchesClient {
    private readonly token: string;

    constructor(token: string) {
        this.token = token;
    }

    async getDota2Matches(requestParams?: GetMatchesRequestParams): Promise<Match[]> {
        const request = new RequestBuilder<Match[]>()
            .setPath('/dota2/matches')
            .setResponseSchema(z.array(Match))
            .addQueryParam({
                key: 'range',
                value: requestParams?.range,
                serialisationMethod: 'deep'
            })
            .addHeader({
                key: 'Authorization',
                value: `Bearer ${this.token}`
            })
            .build();

        return request.execute();
    }
}