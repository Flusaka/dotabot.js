export const Language = {
  English: "English",
  Russian: "Russian",
  Spanish: "Spanish",
} as const;

export type Language = (typeof Language)[keyof typeof Language];
