import type { ChannelConfiguration } from "../ChannelConfiguration";
import type { Stream } from "../data/Stream";

export interface StreamSelector {
  findPreferredStream(
    streams: Stream[],
    channelConfig: ChannelConfiguration,
  ): Stream | undefined;
}
