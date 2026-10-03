import { useCallback, useRef } from "react";
import type { View } from "react-native";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import type { Player } from "@/src/features/game/types";
import { shareGameResult } from "@/src/features/game/utils/shareGameResult";

/** Ref for the end-of-game card plus a handler that shares it as an image. */
export const useShareResult = (winner: Player | null, loser: Player | null, totalRounds: number) => {
  const { t } = useLanguage();
  const captureRef = useRef<View | null>(null);

  const share = useCallback(() => {
    if (winner && loser) shareGameResult(captureRef, winner, loser, totalRounds, t);
  }, [winner, loser, totalRounds, t]);

  return { captureRef, share };
};
