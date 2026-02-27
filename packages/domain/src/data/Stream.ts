import type { Language } from "../src/Language";

export type Stream = {
  url: string;
  main: boolean;
  official: boolean;
  language: Language;
};
