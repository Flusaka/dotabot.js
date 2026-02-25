export const Language = {
  English: "English",
} as const;

export type Language = (typeof Language)[keyof typeof Language];
