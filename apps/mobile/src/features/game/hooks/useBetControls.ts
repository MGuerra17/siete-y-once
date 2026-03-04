import { useMemo, useState } from "react";
import { useLanguage } from "@/src/core/hooks/useLanguage";

type UseBetControlsParams = {
  initialBet: number;
  minBet: number;
  maxBet: number;
  isFirstBet: boolean;
  currentBet: number;
};

/**
 * Encapsulates bet adjustment logic: clamping, validation, and increase/decrease guards.
 * Players cannot decrease an existing bet below the current amount; only increase or keep.
 */
export const useBetControls = ({
  initialBet,
  minBet,
  maxBet,
  isFirstBet,
  currentBet,
}: UseBetControlsParams) => {
  const { t } = useLanguage();
  const [sheetBet, setSheetBet] = useState(initialBet);

  const clampBet = (value: number) => {
    if (value < minBet) return minBet;
    if (value > maxBet) return maxBet;
    return value;
  };

  const handleAdjust = (delta: number) => {
    setSheetBet((prev) => clampBet(prev + delta));
  };

  const canDecreaseBy = (delta: number) =>
    isFirstBet && sheetBet - delta >= minBet;

  const canIncreaseBy = (delta: number) => sheetBet + delta <= maxBet;

  const isValidBet = sheetBet >= minBet && sheetBet <= maxBet;

  const primaryCtaLabel = useMemo(() => {
    if (isFirstBet) return t("game.betSheet.firstBetCta");
    if (sheetBet === currentBet) return t("game.betSheet.keepCta");
    return t("game.betSheet.increaseCta");
  }, [currentBet, isFirstBet, sheetBet, t]);

  /** Resets sheetBet to a given value (used when the sheet opens). */
  const resetTo = (value: number) => setSheetBet(value);

  return {
    sheetBet,
    handleAdjust,
    canDecreaseBy,
    canIncreaseBy,
    isValidBet,
    primaryCtaLabel,
    resetTo,
  };
};
