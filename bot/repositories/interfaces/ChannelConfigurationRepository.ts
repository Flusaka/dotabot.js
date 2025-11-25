import type { Repository } from "../../../repository/Repository";
import type { ChannelConfiguration } from "../../domain/ChannelConfiguration";

export interface ChannelConfigurationRepository extends Repository<ChannelConfiguration> {
    getByChannelId(channelId: bigint): Promise<ChannelConfiguration | undefined>;
}