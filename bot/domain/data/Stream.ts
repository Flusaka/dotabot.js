import type { Language } from "../Language";

export type Stream = {
  url: string;
  main: boolean;
  official: boolean;
  language: Language;
};
