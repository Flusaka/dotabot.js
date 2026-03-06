import type { ChannelConfigurationCache } from "@dotabot.js/domain/cache/ChannelConfigurationCache";
import { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { injectable, inject } from "inversify";
import { LRUCache } from "lru-cache";

const DefaultTTL = 30000;

@injectable()
export class ChannelConfigurationCacheImpl implements ChannelConfigurationCache {
  constructor(
    @inject(Symbols.Cache) private readonly cache: LRUCache<string, string>,
  ) {}

  get(channelId: bigint): ChannelConfiguration | undefined {
    function parse(json: string): ChannelConfiguration {
      // TODO: Maybe have some kind of DTO type for better error handling
      const obj = JSON.parse(json);
      return new ChannelConfiguration(
        BigInt(obj.channelId),
        obj.tiers,
        obj.timezone,
        obj.preferredLanguage,
        obj.dailyNotificationTime,
        obj.id,
      );
    }

    const channelConfigJson = this.cache.get(channelId.toString());
    if (!channelConfigJson) {
      return;
    }

    return parse(channelConfigJson);
  }

  set(
    channelId: bigint,
    channelConfig: ChannelConfiguration,
    ttl?: number,
  ): void {
    function serialise(config: ChannelConfiguration): string {
      return JSON.stringify({
        channelId: config.channelId.toString(),
        tiers: config.tiers,
        timezone: config.timezone,
        preferredLanguage: config.preferredLanguage,
        dailyNotificationTime: config.dailyNotificationTime,
        id: config.id,
      });
    }
    console.log("ChannelConfigurationCacheImpl::set " + channelId);
    const json = serialise(channelConfig);
    console.log(`Channel will be added to cache! Serialising... ${json}`);
    this.cache.set(channelId.toString(), json, {
      ttl: ttl ?? DefaultTTL,
    });
  }

  delete(channelId: bigint): void {
    this.cache.delete(channelId.toString());
  }
}
