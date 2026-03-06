import type { Player } from "@/src/features/game/types";

export type BetBottomSheetProps = {
  visible: boolean;
  player: Player | null;
  currentBet: number;
  minBet: number;
  maxBet: number;
  isFirstBet: boolean;
  onClose: () => void;
  onSubmitBet: (bet: number) => void;
  /** 0 = full, 1 = empty. When set, shows a decreasing countdown bar. */
  countdownProgress?: number | null;
};

