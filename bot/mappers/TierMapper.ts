import { Tier } from "../domain/common/Tier";
import { Tier as TierModel } from "../../generated/prisma/client";

export class TierMapper {
  static toDomain(model: TierModel): Tier {
    switch (model) {
      case TierModel.S:
        return Tier.S;
      case TierModel.A:
        return Tier.A;
      case TierModel.B:
        return Tier.B;
      case TierModel.C:
        return Tier.C;
      case TierModel.D:
        return Tier.D;
      default:
        return Tier.Unknown;
    }
  }

  static toModel(domain: Tier): TierModel {
    switch (domain) {
      case Tier.S:
        return TierModel.S;
      case Tier.A:
        return TierModel.A;
      case Tier.B:
        return TierModel.B;
      case Tier.C:
        return TierModel.C;
      case Tier.D:
        return TierModel.D;
      default:
        return TierModel.Unknown;
    }
  }
}
