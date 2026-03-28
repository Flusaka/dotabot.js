import type { Entity } from "./common/Entity";
import { Language } from "./Language";
import { Tier } from "./common/Tier";
import { TimeOnly } from "./TimeOnly";
import { Timezone } from "./Timezone";

export class ChannelConfiguration implements Entity {
  private _id?: number;
  private _channelId: string;
  private _serverId: string;
  private _tiers: Tier[];
  private _timezone: Timezone;
  private _preferredLanguage: Language;
  private _dailyNotificationTime?: TimeOnly;

  constructor(
    channelId: string,
    serverId: string,
    tiers: Tier[],
    timezone: Timezone,
    preferredLanguage: Language,
    dailyNotificationTime?: TimeOnly,
    id?: number,
  ) {
    this._id = id;
    this._channelId = channelId;
    this._serverId = serverId;
    this._tiers = tiers;
    this._timezone = timezone;
    this._preferredLanguage = preferredLanguage;
    this._dailyNotificationTime = dailyNotificationTime;
  }

  //#region Factory functions
  static defaultNew(
    channelId: string,
    serverId: string,
  ): Omit<ChannelConfiguration, "id"> {
    return new ChannelConfiguration(
      channelId,
      serverId,
      [Tier.S, Tier.A],
      Timezone.GMT,
      Language.English,
    );
  }

  static fromExisting(
    id: number,
    channelId: string,
    serverId: string,
    tiers: Tier[],
    timezone: Timezone,
    preferredLanguage: Language,
    dailyNotificationTime?: TimeOnly,
  ): ChannelConfiguration {
    return new ChannelConfiguration(
      channelId,
      serverId,
      tiers,
      timezone,
      preferredLanguage,
      dailyNotificationTime,
      id,
    );
  }
  //#endregion

  //#region Accessors
  public get id() {
    return this._id;
  }

  public get channelId() {
    return this._channelId;
  }

  public get serverId() {
    return this._serverId;
  }

  public get tiers() {
    return this._tiers;
  }

  public get timezone() {
    return this._timezone;
  }

  public get preferredLanguage() {
    return this._preferredLanguage;
  }

  public get dailyNotificationsEnabled() {
    return this._dailyNotificationTime !== undefined;
  }

  public get dailyNotificationTime() {
    return this._dailyNotificationTime;
  }
  //#endregion

  //#region Mutations
  addTier(tier: Tier): boolean {
    if (this._tiers.includes(tier)) {
      return false;
    }
    this._tiers.push(tier);
    return true;
  }

  removeTier(tier: Tier): boolean {
    if (!this._tiers.includes(tier)) {
      return false;
    }
    this._tiers = this._tiers.filter((t) => t != tier);
    return true;
  }

  setPreferredLanguage(language: Language) {
    this._preferredLanguage = language;
  }

  setTimezone(timezone: Timezone) {
    this._timezone = timezone;
  }

  enableDailyNotifications() {
    this.setDailyNotificationTime(TimeOnly.zero);
  }

  disableDailyNotifications() {
    this._dailyNotificationTime = undefined;
  }

  setDailyNotificationTimeFromString(timeString: string) {
    const time = TimeOnly.parse(timeString);
    this.setDailyNotificationTime(time);
  }

  setDailyNotificationTime(time: TimeOnly) {
    this._dailyNotificationTime = time;
  }
  //#endregion
}
