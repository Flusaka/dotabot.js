import { Tier } from "@dotabot.js/database/generated/prisma/enums";
import { Tier as PandaScoreTier } from "@dotabot.js/pandascore.js/models/common/Tier";

export class TierMapper {
  static toDatabaseModel(tier: PandaScoreTier): Tier {
    switch (tier) {
      case "s":
        return Tier.S;
      case "a":
        return Tier.A;
      case "b":
        return Tier.B;
      case "c":
        return Tier.C;
      case "d":
        return Tier.D;
      case "unranked":
      default:
        return Tier.Unknown;
    }
  }
}
