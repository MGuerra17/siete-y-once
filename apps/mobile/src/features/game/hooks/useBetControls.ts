import { BET_STEPS } from "@seven/game-core";
import { useState } from "react";
import type { TranslationKey } from "@/src/core/i18n/translations";

type UseBetControlsParams = {
  minBet: number;
  maxBet: number;
  isFirstBet: boolean;
  currentBet: number;
};

export type BetStep = (typeof BET_STEPS)[number];

/** Which label the submit button shows for a given amount. */
export function betCtaKey(isFirstBet: boolean, amount: number, currentBet: number): TranslationKey {
  if (isFirstBet) return "game.betSheet.firstBetCta";
  return amount === currentBet ? "game.betSheet.keepCta" : "game.betSheet.increaseCta";
}

/**
 * Bet amount editing: a chosen step size (50K / 100K / 200K) and −/+ around it,
 * clamped to [min, max]. An existing bet can only be kept or raised.
 */
export const useBetControls = ({ minBet, maxBet, isFirstBet, currentBet }: UseBetControlsParams) => {
  const [sheetBet, setSheetBet] = useState(isFirstBet ? minBet : currentBet);
  const [step, setStep] = useState<BetStep>(BET_STEPS[1]);

  const clamp = (value: number) => Math.min(maxBet, Math.max(minBet, value));
  const floor = isFirstBet ? minBet : Math.max(minBet, currentBet);

  return {
    sheetBet,
    step,
    setStep,
    increase: () => setSheetBet((prev) => clamp(prev + step)),
    decrease: () => setSheetBet((prev) => Math.max(floor, clamp(prev - step))),
    canIncrease: sheetBet < maxBet,
    canDecrease: sheetBet > floor,
    isValidBet: sheetBet >= minBet && sheetBet <= maxBet,
    ctaKey: betCtaKey(isFirstBet, sheetBet, currentBet),
    /** Resets the amount when the sheet opens for a new decision. */
    resetTo: (value: number) => setSheetBet(clamp(value)),
  };
};
