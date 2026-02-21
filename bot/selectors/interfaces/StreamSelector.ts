import type { ChannelConfiguration } from "../../domain/ChannelConfiguration";
import type { Stream } from "../../domain/data/Stream";

export interface StreamSelector {
  findPreferredStream(
    streams: Stream[],
    channelConfig: ChannelConfiguration,
  ): Stream | undefined;
}
