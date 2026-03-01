import { inject, injectable } from "inversify";
import type { ChannelConfigurationCache } from "@dotabot.js/domain/cache/ChannelConfigurationCache";
import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { ChannelConfigurationRepository } from "@dotabot.js/domain/repository/ChannelConfigurationRepository";
import { Symbols } from "@dotabot.js/shared/Symbols";

@injectable()
export class CachedChannelConfigurationRepository implements ChannelConfigurationRepository {
  constructor(
    @inject(Symbols.ChannelConfigurationRepository)
    private readonly repository: ChannelConfigurationRepository,
    @inject(Symbols.ChannelConfigurationCache)
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

  deleteByChannelId(channelId: bigint): Promise<boolean> {
    this.cache.delete(channelId);
    return this.repository.deleteByChannelId(channelId);
  }

  delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
