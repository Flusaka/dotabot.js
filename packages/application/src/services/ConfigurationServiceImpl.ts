import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { Tier } from "@dotabot.js/domain/common/Tier";
import type { Language } from "@dotabot.js/domain/Language";
import type { DailyNotificationScheduler } from "@dotabot.js/domain/notification/DailyNotificationScheduler";
import type { ChannelConfigurationRepository } from "@dotabot.js/domain/repository/ChannelConfigurationRepository";
import {
  type ConfigurationService,
  AddTierResult,
  RemoveTierResult,
  SetPreferredLanguageResult,
  SetNotificationTimezoneResult,
  SetDailyNotificationTimeResult,
  EnableDailyNotificationsResult,
} from "@dotabot.js/domain/service/ConfigurationService";
import { TimeOnly, TimeParseError } from "@dotabot.js/domain/TimeOnly";
import type { Timezone } from "@dotabot.js/domain/Timezone";
import { Symbols } from "@dotabot.js/shared/Symbols";
import { inject, named } from "inversify";

export class ConfigurationServiceImpl implements ConfigurationService {
  constructor(
    @inject(Symbols.ChannelConfigurationRepository)
    @named("cached")
    private readonly channelConfigRepo: ChannelConfigurationRepository,
    @inject(Symbols.DailyNotificationScheduler)
    private readonly dailyNotificationScheduler: DailyNotificationScheduler,
  ) {}

  async getConfiguration(
    channelId: bigint,
  ): Promise<ChannelConfiguration | undefined> {
    return this.channelConfigRepo.getByChannelId(channelId);
  }

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

  async enableDailyNotifications(
    channelId: bigint,
    enable: boolean,
  ): Promise<EnableDailyNotificationsResult> {
    const channel = await this.channelConfigRepo.getByChannelId(channelId);
    if (!channel) {
      return EnableDailyNotificationsResult.ChannelNotConnected;
    }

    if (enable) {
      channel.enableDailyNotifications();
    } else {
      channel.disableDailyNotifications();
    }

    if (!(await this.channelConfigRepo.update(channel.id!, channel))) {
      return EnableDailyNotificationsResult.UnknownError;
    }

    if (enable) {
      this.dailyNotificationScheduler.schedule(channel);
    } else {
      this.dailyNotificationScheduler.unschedule(channelId);
    }
    return EnableDailyNotificationsResult.Success;
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
      const time = TimeOnly.parse(timeString);
      channel.setDailyNotificationTime(time);

      if (!(await this.channelConfigRepo.update(channel.id!, channel))) {
        return SetDailyNotificationTimeResult.UnknownError;
      }
      this.dailyNotificationScheduler.schedule(channel);

      return SetDailyNotificationTimeResult.Success;
    } catch (err: unknown) {
      if (err instanceof TimeParseError) {
        return SetDailyNotificationTimeResult.InvalidTimeString;
      }
      return SetDailyNotificationTimeResult.UnknownError;
    }
  }
}
