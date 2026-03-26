import type { Repository } from "./Repository";
import type { ChannelConfiguration } from "../ChannelConfiguration";

export interface ChannelConfigurationRepository extends Repository<ChannelConfiguration> {
  getByChannelId(channelId: string): Promise<ChannelConfiguration | undefined>;
  deleteByChannelId(channelId: string): Promise<boolean>;
}
