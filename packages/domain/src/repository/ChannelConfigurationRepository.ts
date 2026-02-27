import type { Repository } from "./Repository";
import type { ChannelConfiguration } from "../src/ChannelConfiguration";

export interface ChannelConfigurationRepository extends Repository<ChannelConfiguration> {
  getByChannelId(channelId: bigint): Promise<ChannelConfiguration | undefined>;
}
