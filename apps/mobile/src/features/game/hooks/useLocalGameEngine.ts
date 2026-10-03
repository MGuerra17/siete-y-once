import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useCallback, useMemo } from "react";
import { createLocalGameEngine } from "@/src/features/game/engine/localGameEngine";
import type { IGameEngine } from "@/src/features/game/engine/IGameEngine";
import { useGameStore } from "@/src/features/game/store/gameStore";
import type { TranslationKey } from "@/src/core/i18n/translations";

/** Replaces `{key}` placeholders in a translation template with the given params. */
const formatMessage = (
  template: string,
  params: Record<string, string | number>,
): string =>
  Object.entries(params).reduce(
    (msg, [key, value]) => msg.replace(`{${key}}`, String(value)),
    template,
  );

/**
 * Creates and memoizes a local (offline) game engine.
 * Bridges the translation layer to the engine's toast function.
 */
export const useLocalGameEngine = (): IGameEngine => {
  const { t } = useLanguage();

  const toast = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const template = t(key as TranslationKey);
      return params ? formatMessage(template, params) : template;
    },
    [t],
  );

  const engine = useMemo(
    () => createLocalGameEngine(() => useGameStore.getState(), toast),
    [toast],
  );

  return engine;
};
