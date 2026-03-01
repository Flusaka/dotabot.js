import type { Repository } from "./Repository";
import type { ChannelConfiguration } from "../ChannelConfiguration";

export interface ChannelConfigurationRepository extends Repository<ChannelConfiguration> {
  getByChannelId(channelId: bigint): Promise<ChannelConfiguration | undefined>;
  deleteByChannelId(channelId: bigint): Promise<boolean>;
}
