import type { Entity } from "../common/Entity";
import { Language } from "./Language";
import { Tier } from "./Tier";
import { TimeOnly } from "./TimeOnly";
import { Timezone } from "./Timezone";

export class ChannelConfiguration implements Entity {
  private _id?: number;
  private _channelId: bigint;
  private _tiers: Tier[];
  private _timezone: Timezone;
  private _preferredLanguage: Language;
  private _dailyNotificationTime?: TimeOnly;

  constructor(
    channelId: bigint,
    tiers: Tier[],
    timezone: Timezone,
    preferredLanguage: Language,
    dailyNotificationTime?: TimeOnly,
    id?: number,
  ) {
    this._id = id;
    this._channelId = channelId;
    this._tiers = tiers;
    this._timezone = timezone;
    this._preferredLanguage = preferredLanguage;
    this._dailyNotificationTime = dailyNotificationTime;
  }

  //#region Factory functions
  static defaultNew(channelId: bigint): Omit<ChannelConfiguration, "id"> {
    return new ChannelConfiguration(
      channelId,
      [Tier.S, Tier.A],
      Timezone.GMT,
      Language.English,
    );
  }

  static fromExisting(
    id: number,
    channelId: bigint,
    tiers: Tier[],
    timezone: Timezone,
    preferredLanguage: Language,
    dailyNotificationTime?: TimeOnly,
  ): ChannelConfiguration {
    return new ChannelConfiguration(
      channelId,
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

  public get tiers() {
    return this._tiers;
  }

  public get timezone() {
    return this._timezone;
  }

  public get preferredLanguage() {
    return this._preferredLanguage;
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

  setDailyNotificationTime(timeString: string) {
    this._dailyNotificationTime = TimeOnly.parse(timeString);
  }
  //#endregion
}
