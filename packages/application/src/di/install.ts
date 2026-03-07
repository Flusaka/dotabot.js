import type { ChannelConfigurationCache } from "@dotabot.js/domain/cache/ChannelConfigurationCache";
import type { ChannelConfigurationRepository } from "@dotabot.js/domain/repository/ChannelConfigurationRepository";
import type { ConfigurationService } from "@dotabot.js/domain/service/ConfigurationService";
import type { ConnectionService } from "@dotabot.js/domain/service/ConnectionService";
import type { StreamSelector } from "@dotabot.js/domain/selector/StreamSelector";
import type { TournamentService } from "@dotabot.js/domain/service/TournamentService";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { Container } from "inversify";
import { LRUCache } from "lru-cache/raw";
import { ChannelConfigurationCacheImpl } from "../caches/ChannelConfigurationCacheImpl";
import { CachedChannelConfigurationRepository } from "../repositories/CachedChannelConfigurationRepository";
import { ConfigurationServiceImpl } from "../services/ConfigurationServiceImpl";
import { ConnectionServiceImpl } from "../services/ConnectionServiceImpl";
import { TournamentServiceImpl } from "../services/TournamentServiceImpl";
import { PreferredLanguageStreamSelector } from "../selectors/PreferredLanguageStreamSelector";

export function installApplicationDependencies(container: Container) {
  // Caches
  container
    .bind<LRUCache<string, string>>(Symbols.Cache)
    .toDynamicValue(() => {
      return new LRUCache({
        max: 1000,
      });
    })
    .inSingletonScope();
  container
    .bind<ChannelConfigurationCache>(Symbols.ChannelConfigurationCache)
    .to(ChannelConfigurationCacheImpl)
    .inSingletonScope();
  container
    .bind<ChannelConfigurationRepository>(
      Symbols.ChannelConfigurationRepository,
    )
    .to(CachedChannelConfigurationRepository)
    .inSingletonScope()
    .whenNamed("cached");

  // Service dependencies
  container
    .bind<ConnectionService>(Symbols.ConnectionService)
    .to(ConnectionServiceImpl)
    .inSingletonScope();
  container
    .bind<ConfigurationService>(Symbols.ConfigurationService)
    .to(ConfigurationServiceImpl)
    .inSingletonScope();
  container
    .bind<TournamentService>(Symbols.TournamentService)
    .to(TournamentServiceImpl)
    .inSingletonScope();
  container
    .bind<StreamSelector>(Symbols.StreamSelector)
    .to(PreferredLanguageStreamSelector)
    .inSingletonScope();
}
