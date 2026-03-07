import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { Stream } from "@dotabot.js/domain/data/Stream";
import type { Language } from "@dotabot.js/domain/Language";
import type { StreamSelector } from "@dotabot.js/domain/selector/StreamSelector";
import { injectable } from "inversify";

@injectable()
export class PreferredLanguageStreamSelector implements StreamSelector {
  findPreferredStream(
    streams: Stream[],
    channelConfig: ChannelConfiguration,
  ): Stream | undefined {
    function getPriorityIndexForStream(
      stream: Stream,
      preferredLanguage: Language,
    ): number {
      if (
        stream.official &&
        stream.main &&
        stream.language === preferredLanguage
      ) {
        return 0;
      } else if (stream.official && stream.language === preferredLanguage) {
        return 1;
      } else if (stream.language === preferredLanguage) {
        return 2;
      } else if (stream.official && stream.main) {
        return 3;
      } else if (stream.official) {
        return 4;
      }
      return 5;
    }

    if (streams.length === 0) {
      return;
    }

    let preferredStream: Stream | undefined;
    let currentPriorityIndex = Number.MAX_VALUE;
    for (const stream of streams) {
      const priority = getPriorityIndexForStream(
        stream,
        channelConfig.preferredLanguage,
      );
      if (priority < currentPriorityIndex) {
        currentPriorityIndex = priority;
        preferredStream = stream;
      }
    }

    return preferredStream;
  }
}
