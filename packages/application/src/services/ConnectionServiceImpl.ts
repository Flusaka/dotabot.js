import { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { DailyNotificationScheduler } from "@dotabot.js/domain/notification/DailyNotificationScheduler";
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
    @inject(Symbols.DailyNotificationScheduler)
    private dailyNotificationScheduler: DailyNotificationScheduler,
  ) {}

  async connect(
    channelId: string,
    serverId: string,
  ): Promise<ConnectionResult> {
    const existing = await this.channelConfigRepo.getByChannelId(channelId);
    if (existing) {
      return ConnectionResult.ChannelAlreadyConnected;
    }

    const result = await this.channelConfigRepo.create(
      ChannelConfiguration.defaultNew(channelId, serverId),
    );
    if (!result) {
      return ConnectionResult.UnknownError;
    }
    return ConnectionResult.Success;
  }

  async disconnect(channelId: string): Promise<DisconnectionResult> {
    const existing = await this.channelConfigRepo.getByChannelId(channelId);
    if (!existing) {
      return DisconnectionResult.ChannelNotConnected;
    }

    const result = await this.channelConfigRepo.deleteByChannelId(channelId);
    if (!result) {
      return DisconnectionResult.UnknownError;
    }
    // Unschedule any potential daily notifications for this channel
    await this.dailyNotificationScheduler.unschedule(channelId);
    return DisconnectionResult.Success;
  }

  async disconnectAll(serverId: string): Promise<void> {
    await this.channelConfigRepo.deleteByServerId(serverId);
    // TODO: Clear daily notification schedules
  }
}
