import { Language } from "../../generated/prisma/enums";
import { Language as StreamLanguage } from "../../pandascorejs/models/common/Stream";

export class LanguageCodeMapper {
  static toDatabaseModel(languageCode: StreamLanguage): Language {
    switch (languageCode) {
      case "ru":
        return Language.Russian;
      case "es":
        return Language.Spanish;
      case "en":
      default: {
        return Language.English;
      }
    }
  }
}
