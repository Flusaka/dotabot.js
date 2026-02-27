import type { ChannelConfiguration } from "../src/ChannelConfiguration";
import type { Stream } from "../data/Stream";

export interface StreamSelector {
  findPreferredStream(
    streams: Stream[],
    channelConfig: ChannelConfiguration,
  ): Stream | undefined;
}
