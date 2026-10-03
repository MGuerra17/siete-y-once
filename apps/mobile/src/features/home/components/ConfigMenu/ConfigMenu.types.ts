import type { Language } from "@/src/core/i18n/translations";

export type ConfigMenuProps = {
  visible: boolean;
  onClose: () => void;
  language: Language;
  onSelectLanguage: (language: Language) => void;
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
};
