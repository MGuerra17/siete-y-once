import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { detectDeviceLanguage } from "@/src/core/i18n/detectLanguage";
import type { Language } from "@/src/core/i18n/translations";

type SettingsState = {
  language: Language;
  soundEnabled: boolean;
  setLanguage: (language: Language) => void;
  setSoundEnabled: (enabled: boolean) => void;
};

/** User preferences, persisted across launches. */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: detectDeviceLanguage(),
      soundEnabled: true,
      setLanguage: (language) => set({ language }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    }),
    {
      name: "@siete-y-once/settings",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ language, soundEnabled }) => ({ language, soundEnabled }),
    },
  ),
);
