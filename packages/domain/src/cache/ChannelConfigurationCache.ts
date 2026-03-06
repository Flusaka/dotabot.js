import type { ChannelConfiguration } from "../ChannelConfiguration";

export interface ChannelConfigurationCache {
  get(channelId: bigint): ChannelConfiguration | undefined;
  set(channelId: bigint, channelConfig: ChannelConfiguration): void;
  delete(channelId: bigint): void;
}
