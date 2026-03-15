import type { ChannelConfigurationRepository } from "@dotabot.js/domain/repository/ChannelConfigurationRepository";
import type { TournamentRepository } from "@dotabot.js/domain/repository/TournamentRepository";
import type { Container } from "inversify";
import { PrismaChannelConfigurationRepository } from "../repositories/PrismaChannelConfigurationRepository";
import { PrismaTournamentRepository } from "../repositories/PrismaTournamentRepository";
import { Symbols as SharedSymbols } from "@dotabot.js/shared/Symbols";

export function installDatabaseDependencies(container: Container) {
  container
    .bind<ChannelConfigurationRepository>(
      SharedSymbols.ChannelConfigurationRepository,
    )
    .to(PrismaChannelConfigurationRepository)
    .inSingletonScope()
    .whenDefault();
  container
    .bind<TournamentRepository>(SharedSymbols.TournamentRepository)
    .to(PrismaTournamentRepository)
    .inSingletonScope();
}
