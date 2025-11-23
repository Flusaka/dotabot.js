import { MatchesClient } from "./clients/MatchesClient";

export class Client {
    private readonly token: string;

    readonly matches: MatchesClient;

    constructor(token: string) {
        this.token = token;
        this.matches = new MatchesClient(token);
    }
}