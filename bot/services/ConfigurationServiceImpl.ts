import { inject } from "inversify";
import type { Timezone } from "../../generated/prisma/enums";
import type { Language } from "../domain/Language";
import type { Tier } from "../domain/Tier";
import type { ConfigurationService } from "./interfaces/ConfigurationService";
import { Types } from "../di/Types";
import type { ChannelConfigurationRepository } from "../repositories/interfaces/ChannelConfigurationRepository";

export class ConfigurationServiceImpl implements ConfigurationService {
    constructor(@inject(Types.ChannelConfigurationRepository) private channelConfigRepo: ChannelConfigurationRepository) {}

    addTier(tier: Tier): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    removeTier(tier: Tier): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    setPreferredLanguage(language: Language): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    setNotificationTimezone(timezone: Timezone): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    setDailyNotificationTime(timeString: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}