import { useCallback } from "react";
import { formatMessage, type MessageParams } from "@/src/core/i18n/format";
import { translate, type TranslationKey } from "@/src/core/i18n/translations";
import { useSettingsStore } from "@/src/core/settings/settingsStore";

export type TranslateFn = (key: TranslationKey, params?: MessageParams) => string;

/** Current language, its setter and a `t(key, params?)` helper with `{placeholder}` interpolation. */
export const useLanguage = () => {
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const t: TranslateFn = useCallback(
    (key, params) => formatMessage(translate(language, key), params),
    [language],
  );

  return { language, setLanguage, t };
};
