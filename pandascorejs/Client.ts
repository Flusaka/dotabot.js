import z from "zod";
import { Match } from "./models/match/Match";

export class Client {
    private readonly baseUri: string = 'https://api.pandascore.co';

    token: string;
    headers: Headers;

    constructor(token: string) {
        this.token = token;
        this.headers = new Headers();
        this.headers.append('Authorization', `Bearer ${token}`);
    }

    async getMatches(): Promise<Match[]> {
        const endpoint = `${this.baseUri}/dota2/matches`;
        const response = await fetch(endpoint, { headers: this.headers });
        return z.array(Match).parseAsync(await response.json());
    }
}