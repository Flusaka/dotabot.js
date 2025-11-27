import type { Timezone } from "../../../generated/prisma/enums";
import type { Language } from "../../domain/Language";
import type { Tier } from "../../domain/Tier";

export interface ConfigurationService {
    // Tier configuration
    addTier(tier: Tier): Promise<boolean>;
    removeTier(tier: Tier): Promise<boolean>;

    // Language configuration
    setPreferredLanguage(language: Language): Promise<boolean>;

    // Timezone configuration
    setNotificationTimezone(timezone: Timezone): Promise<boolean>;
    
    // Daily notification configuration
    setDailyNotificationTime(timeString: string): Promise<boolean>;
}