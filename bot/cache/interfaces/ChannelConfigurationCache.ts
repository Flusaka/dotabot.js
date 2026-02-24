import type { ChannelConfiguration } from "../../domain/ChannelConfiguration";

export interface ChannelConfigurationCache {
  get(channelId: bigint): ChannelConfiguration | undefined;
  set(channelId: bigint, channelConfig: ChannelConfiguration): void;
}
