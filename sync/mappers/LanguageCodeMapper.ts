import { Language } from "../../generated/prisma/enums";

export class LanguageCodeMapper {
  static toDatabaseModel(languageCode: string): Language {
    switch (languageCode) {
      default: {
        return Language.English;
      }
    }
  }
}
