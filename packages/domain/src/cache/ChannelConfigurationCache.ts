import type { ChannelConfiguration } from "../ChannelConfiguration";

export interface ChannelConfigurationCache {
  get(channelId: string): ChannelConfiguration | undefined;
  set(
    channelId: string,
    channelConfig: ChannelConfiguration,
    ttl?: number,
  ): void;
  delete(channelId: string): void;
}
