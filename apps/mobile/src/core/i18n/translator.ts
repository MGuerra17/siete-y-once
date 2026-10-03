import { formatMessage, type MessageParams } from "@/src/core/i18n/format";
import { translate, type TranslationKey } from "@/src/core/i18n/translations";
import { useSettingsStore } from "@/src/core/settings/settingsStore";

/** Translates outside React (controllers, services) using the current language setting. */
export const translateNow = (key: TranslationKey, params?: MessageParams): string =>
  formatMessage(translate(useSettingsStore.getState().language, key), params);
