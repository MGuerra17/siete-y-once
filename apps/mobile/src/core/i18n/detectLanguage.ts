import type { Language } from "@/src/core/i18n/translations";

/** Picks Spanish for Spanish-speaking devices and English otherwise. */
export const detectDeviceLanguage = (): Language => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale.toLowerCase().startsWith("es") ? "es" : "en";
  } catch {
    return "es";
  }
};
