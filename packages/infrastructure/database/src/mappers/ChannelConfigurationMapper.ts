import { type ChannelConfiguration as ChannelConfigurationModel } from "../../generated/prisma/client";
import { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import { LanguageMapper } from "./LanguageMapper";
import { TierMapper } from "./TierMapper";
import { TimezoneMapper } from "./TimezoneMapper";

export class ChannelConfigurationMapper {
  static toDomain(model: ChannelConfigurationModel): ChannelConfiguration {
    return ChannelConfiguration.fromExisting(
      model.id,
      model.channelId,
      model.tiers.map(TierMapper.toDomain),
      TimezoneMapper.toDomain(model.timezone),
      LanguageMapper.toDomain(model.preferredLanguage),
    );
  }

  static toModel(
    domain: Omit<ChannelConfiguration, "id">,
  ): Omit<ChannelConfigurationModel, "id"> {
    return {
      channelId: domain.channelId,
      tiers: domain.tiers.map(TierMapper.toModel),
      preferredLanguage: LanguageMapper.toModel(domain.preferredLanguage),
      timezone: TimezoneMapper.toModel(domain.timezone),
      dailyNotificationTime: null,
    };
  }

  static toPartialModel(
    domain: Partial<Omit<ChannelConfiguration, "id">>,
  ): Partial<Omit<ChannelConfigurationModel, "id">> {
    return {
      channelId: domain.channelId,
      tiers: domain.tiers?.map(TierMapper.toModel),
      preferredLanguage: domain.preferredLanguage
        ? LanguageMapper.toModel(domain.preferredLanguage)
        : undefined,
      timezone: domain.timezone
        ? TimezoneMapper.toModel(domain.timezone)
        : undefined,
      dailyNotificationTime: null,
    };
  }
}
