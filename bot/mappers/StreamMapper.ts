import type { JsonArray } from "../../generated/prisma/internal/prismaNamespace";
import type { Stream } from "../domain/data/Stream";

export class StreamMapper {
  static toDomain(streams: JsonArray): Stream[] {
    return streams
      .map<Stream | null>((jsonStream) => {
        if (!jsonStream) {
          return null;
        }
        const jsonString = JSON.stringify(jsonStream);

        return JSON.parse(jsonString);
      })
      .filter((stream) => stream !== null);
  }
}
