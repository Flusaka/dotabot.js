import type { Entity } from "../common/Entity";
import { Language } from "./Language";
import { Tier } from "./Tier";
import { TimeOnly } from "./TimeOnly";
import { Timezone } from "./Timezone";

export class ChannelConfiguration implements Entity {
    id: number;
    channelId: bigint;
    tiers: Tier[];
    timezone: Timezone;
    preferredLanguage: Language;
    dailyNotificationTime?: TimeOnly;

    constructor(
        id: number, 
        channelId: bigint,
        tiers: Tier[], 
        timezone: Timezone, 
        preferredLanguage: Language, 
        dailyNotificationTime?: TimeOnly
    ) {
        this.id = id;
        this.channelId = channelId;
        this.tiers = tiers;
        this.timezone = timezone;
        this.preferredLanguage = preferredLanguage;
        this.dailyNotificationTime = dailyNotificationTime;
    }

    static defaultNew(channelId: bigint): Omit<ChannelConfiguration, 'id'> {
        return {
            channelId,
            preferredLanguage: Language.English,
            tiers: [Tier.S, Tier.A],
            timezone: Timezone.GMT,
        };
    }

    static fromExisting(
        id: number,
        channelId: bigint,
        tiers: Tier[], 
        timezone: Timezone, 
        preferredLanguage: Language,
        dailyNotificationTime?: TimeOnly
    ): ChannelConfiguration {
        return {
            id,
            channelId,
            tiers,
            timezone,
            preferredLanguage,
            dailyNotificationTime,
        };
    }
}