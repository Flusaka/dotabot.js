import { Language } from "@dotabot.js/domain/Language";
import { Language as LanguageModel } from "../../generated/prisma/client";

export class LanguageMapper {
  static toDomain(model: LanguageModel): Language {
    switch (model) {
      case LanguageModel.English:
      default:
        return Language.English;
    }
  }

  static toModel(domain: Language): LanguageModel {
    switch (domain) {
      case Language.English:
      default:
        return LanguageModel.English;
    }
  }
}
