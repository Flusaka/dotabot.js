import { Container } from "inversify";
import { Types } from "./Types";
import type { ChannelConfigurationRepository } from "../repositories/interfaces/ChannelConfigurationRepository";
import { PrismaChannelConfigurationRepository } from "../repositories/PrismaChannelConfigurationRepository";
import { PrismaClient } from "../../generated/prisma/client";
import prisma from "../../database/prisma";
import type { ConnectionService } from "../services/interfaces/ConnectionService";
import { ConnectionServiceImpl } from "../services/ConnectionServiceImpl";
import type { ConfigurationService } from "../services/interfaces/ConfigurationService";
import { ConfigurationServiceImpl } from "../services/ConfigurationServiceImpl";
import type { TournamentRepository } from "../repositories/interfaces/TournamentRepository";
import { PrismaTournamentRepository } from "../repositories/PrismaTournamentRepository";
import type { TournamentService } from "../services/interfaces/TournamentService";
import { TournamentServiceImpl } from "../services/TournamentServiceImpl";
import type { TournamentEmbedMessageBuilder } from "../message/interfaces/TournamentEmbedMessageBuilder";
import { TournamentEmbedMessageBuilderImpl } from "../message/TournamentEmbedMessageBuilderImpl";
import type { StreamSelector } from "../selectors/interfaces/StreamSelector";
import { PreferredLanguageStreamSelector } from "../selectors/PreferredLanguageStreamSelector";
import type { ChannelConfigurationCache } from "../cache/interfaces/ChannelConfigurationCache";
import { ChannelConfigurationCacheImpl } from "../cache/ChannelConfigurationCacheImpl";
import { CachedChannelConfigurationRepository } from "../repositories/CachedChannelConfigurationRepository";
import { LRUCache } from "lru-cache";

const botContainer = new Container();
// Bot-specific dependencies
botContainer
  .bind<TournamentEmbedMessageBuilder>(Types.TournamentEmbedMessageBuilder)
  .to(TournamentEmbedMessageBuilderImpl)
  .inSingletonScope();
botContainer
  .bind<StreamSelector>(Types.StreamSelector)
  .to(PreferredLanguageStreamSelector)
  .inSingletonScope();

// Database/Repository dependencies
botContainer
  .bind<ChannelConfigurationRepository>(Types.ChannelConfigurationRepository)
  .to(PrismaChannelConfigurationRepository)
  .inSingletonScope()
  .whenDefault();
botContainer
  .bind<TournamentRepository>(Types.TournamentRepository)
  .to(PrismaTournamentRepository)
  .inSingletonScope();
botContainer.bind<PrismaClient>(Types.PrismaClient).toConstantValue(prisma);

// Caches
botContainer
  .bind<LRUCache<string, string>>(Types.Cache)
  .toDynamicValue(() => {
    return new LRUCache({
      max: 1000,
    });
  })
  .inSingletonScope();
botContainer
  .bind<ChannelConfigurationCache>(Types.ChannelConfigurationCache)
  .to(ChannelConfigurationCacheImpl)
  .inSingletonScope();
botContainer
  .bind<ChannelConfigurationRepository>(Types.ChannelConfigurationRepository)
  .to(CachedChannelConfigurationRepository)
  .inSingletonScope()
  .whenNamed("cached");

// Service dependencies
botContainer
  .bind<ConnectionService>(Types.ConnectionService)
  .to(ConnectionServiceImpl)
  .inSingletonScope();
botContainer
  .bind<ConfigurationService>(Types.ConfigurationService)
  .to(ConfigurationServiceImpl)
  .inSingletonScope();
botContainer
  .bind<TournamentService>(Types.TournamentService)
  .to(TournamentServiceImpl)
  .inSingletonScope();

export { botContainer };
