import { inject, injectable } from "inversify";
import type { ChannelConfigurationCache } from "../cache/interfaces/ChannelConfigurationCache";
import type { ChannelConfiguration } from "../domain/ChannelConfiguration";
import type { ChannelConfigurationRepository } from "./interfaces/ChannelConfigurationRepository";
import { Types } from "../di/Types";

@injectable()
export class CachedChannelConfigurationRepository implements ChannelConfigurationRepository {
  constructor(
    @inject(Types.ChannelConfigurationRepository)
    private readonly repository: ChannelConfigurationRepository,
    @inject(Types.ChannelConfigurationCache)
    private readonly cache: ChannelConfigurationCache,
  ) {}

  async getByChannelId(
    channelId: bigint,
  ): Promise<ChannelConfiguration | undefined> {
    let channelConfig = this.cache.get(channelId);
    if (!channelConfig) {
      channelConfig = await this.repository.getByChannelId(channelId);
      if (channelConfig) {
        this.cache.set(channelId, channelConfig);
      }
    }
    return channelConfig;
  }

  getById(id: number): Promise<ChannelConfiguration> {
    return this.repository.getById(id);
  }

  create(
    entity: Omit<ChannelConfiguration, "id">,
  ): Promise<ChannelConfiguration> {
    const channelConfig = this.repository.create(entity);
    return channelConfig;
  }

  update(id: number, entity: Partial<ChannelConfiguration>): Promise<boolean> {
    return this.repository.update(id, entity);
  }

  delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
