export const Language = {
  English: "English",
  Russian: "Russian",
  Spanish: "Spanish",
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export function isLanguage(value: string): value is Language {
  return Object.values(Language).includes(value as Language);
}
