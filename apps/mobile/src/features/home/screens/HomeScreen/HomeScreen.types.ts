import type { Language } from "@/src/core/i18n/translations";

export type HomeScreenProps = {
  title: string;
  startLabel: string;
  language: Language;
  englishLabel: string;
  spanishLabel: string;
  onStart: () => void;
  onSelectLanguage: (language: Language) => void;
};

