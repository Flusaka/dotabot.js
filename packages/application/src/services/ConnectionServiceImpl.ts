import { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { ChannelConfigurationRepository } from "@dotabot.js/domain/repository/ChannelConfigurationRepository";
import {
  ConnectionResult,
  DisconnectionResult,
  type ConnectionService,
} from "@dotabot.js/domain/service/ConnectionService";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { inject, injectable, named } from "inversify";

@injectable()
export class ConnectionServiceImpl implements ConnectionService {
  constructor(
    @inject(Symbols.ChannelConfigurationRepository)
    @named("cached")
    private channelConfigRepo: ChannelConfigurationRepository,
  ) {}

  async connect(channelId: bigint): Promise<ConnectionResult> {
    const existing = await this.channelConfigRepo.getByChannelId(channelId);
    if (existing) {
      return ConnectionResult.ChannelAlreadyConnected;
    }

    const result = await this.channelConfigRepo.create(
      ChannelConfiguration.defaultNew(channelId),
    );
    if (!result) {
      return ConnectionResult.UnknownError;
    }
    return ConnectionResult.Success;
  }

  async disconnect(channelId: bigint): Promise<DisconnectionResult> {
    const existing = await this.channelConfigRepo.getByChannelId(channelId);
    if (!existing) {
      return DisconnectionResult.ChannelNotConnected;
    }

    const result = await this.channelConfigRepo.deleteByChannelId(channelId);
    if (!result) {
      return DisconnectionResult.UnknownError;
    }
    return DisconnectionResult.Success;
  }
}
