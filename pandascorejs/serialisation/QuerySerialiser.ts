import type { RequestParameter } from "../request/types";
import { Serialiser } from "./Serialiser";

export class QuerySerialiser extends Serialiser {
    public serialise(query: Map<string, RequestParameter>): string {
        if(!query) {
            return '';
        }

        const output: string[] = [];
        query.forEach((param) => output.push(this.serialiseValue(param)));
        return output.length > 0 ? `?${output.join('&')}` : '';
    }
}