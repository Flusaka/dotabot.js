import { inject } from "inversify";
import type { Language } from "../domain/Language";
import type { Tier } from "../domain/Tier";
import {
  AddTierResult,
  RemoveTierResult,
  SetDailyNotificationTimeResult,
  SetNotificationTimezoneResult,
  SetPreferredLanguageResult,
  type ConfigurationService,
} from "./interfaces/ConfigurationService";
import { Types } from "../di/Types";
import type { ChannelConfigurationRepository } from "../repositories/interfaces/ChannelConfigurationRepository";
import { TimeParseError } from "../domain/TimeOnly";
import type { Timezone } from "../domain/Timezone";

export class ConfigurationServiceImpl implements ConfigurationService {
  constructor(
    @inject(Types.ChannelConfigurationRepository)
    private channelConfigRepo: ChannelConfigurationRepository,
  ) {}

  async addTier(channelId: bigint, tier: Tier): Promise<AddTierResult> {
    const channel = await this.channelConfigRepo.getByChannelId(channelId);
    if (!channel) {
      return AddTierResult.ChannelNotConnected;
    }

    if (!channel.addTier(tier)) {
      return AddTierResult.TierAlreadyAdded;
    }

    if (!(await this.channelConfigRepo.update(channel.id!, channel))) {
      return AddTierResult.UnknownError;
    }

    return AddTierResult.Success;
  }

  async removeTier(channelId: bigint, tier: Tier): Promise<RemoveTierResult> {
    const channel = await this.channelConfigRepo.getByChannelId(channelId);
    if (!channel) {
      return RemoveTierResult.ChannelNotConnected;
    }

    if (!channel.removeTier(tier)) {
      return RemoveTierResult.TierNotAdded;
    }

    if (!(await this.channelConfigRepo.update(channel.id!, channel))) {
      return RemoveTierResult.UnknownError;
    }

    return RemoveTierResult.Success;
  }

  async setPreferredLanguage(
    channelId: bigint,
    language: Language,
  ): Promise<SetPreferredLanguageResult> {
    const channel = await this.channelConfigRepo.getByChannelId(channelId);
    if (!channel) {
      return SetPreferredLanguageResult.ChannelNotConnected;
    }

    channel.setPreferredLanguage(language);

    if (!(await this.channelConfigRepo.update(channel.id!, channel))) {
      return SetPreferredLanguageResult.UnknownError;
    }

    return SetPreferredLanguageResult.Success;
  }

  async setNotificationTimezone(
    channelId: bigint,
    timezone: Timezone,
  ): Promise<SetNotificationTimezoneResult> {
    const channel = await this.channelConfigRepo.getByChannelId(channelId);
    if (!channel) {
      return SetNotificationTimezoneResult.ChannelNotConnected;
    }

    channel.setTimezone(timezone);

    if (!(await this.channelConfigRepo.update(channel.id!, channel))) {
      return SetNotificationTimezoneResult.UnknownError;
    }

    return SetNotificationTimezoneResult.Success;
  }

  async setDailyNotificationTime(
    channelId: bigint,
    timeString: string,
  ): Promise<SetDailyNotificationTimeResult> {
    const channel = await this.channelConfigRepo.getByChannelId(channelId);
    if (!channel) {
      return SetDailyNotificationTimeResult.ChannelNotConnected;
    }

    try {
      channel.setDailyNotificationTime(timeString);

      if (!(await this.channelConfigRepo.update(channel.id!, channel))) {
        return SetDailyNotificationTimeResult.UnknownError;
      }
      return SetDailyNotificationTimeResult.Success;
    } catch (err: unknown) {
      if (err instanceof TimeParseError) {
        return SetDailyNotificationTimeResult.InvalidTimeString;
      }
      return SetDailyNotificationTimeResult.UnknownError;
    }
  }
}
