import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";

export interface ChannelConfigurationCache {
  get(channelId: bigint): ChannelConfiguration | undefined;
  set(channelId: bigint, channelConfig: ChannelConfiguration): void;
  delete(channelId: bigint): void;
}
