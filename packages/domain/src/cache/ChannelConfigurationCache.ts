import type { ChannelConfiguration } from "../src/ChannelConfiguration";

export interface ChannelConfigurationCache {
  get(channelId: bigint): ChannelConfiguration | undefined;
  set(channelId: bigint, channelConfig: ChannelConfiguration): void;
}
