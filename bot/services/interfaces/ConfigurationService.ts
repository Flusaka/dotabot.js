import type { Language } from "../../domain/Language";
import type { Tier } from "../../domain/Tier";
import type { Timezone } from "../../domain/Timezone";

export enum AddTierResult {
  Success,
  ChannelNotConnected,
  TierAlreadyAdded,
  UnknownError,
}

export enum RemoveTierResult {
  Success,
  ChannelNotConnected,
  TierNotAdded,
  UnknownError,
}

export enum SetPreferredLanguageResult {
  Success,
  ChannelNotConnected,
  UnknownError,
}

export enum SetNotificationTimezoneResult {
  Success,
  ChannelNotConnected,
  UnknownError,
}

export enum SetDailyNotificationTimeResult {
  Success,
  ChannelNotConnected,
  InvalidTimeString,
  UnknownError,
}

export interface ConfigurationService {
  // Tier configuration
  addTier(channelId: bigint, tier: Tier): Promise<AddTierResult>;
  removeTier(channelId: bigint, tier: Tier): Promise<RemoveTierResult>;

  // Language configuration
  setPreferredLanguage(
    channelId: bigint,
    language: Language,
  ): Promise<SetPreferredLanguageResult>;

  // Timezone configuration
  setNotificationTimezone(
    channelId: bigint,
    timezone: Timezone,
  ): Promise<SetNotificationTimezoneResult>;

  // Daily notification configuration
  setDailyNotificationTime(
    channelId: bigint,
    timeString: string,
  ): Promise<SetDailyNotificationTimeResult>;
}
