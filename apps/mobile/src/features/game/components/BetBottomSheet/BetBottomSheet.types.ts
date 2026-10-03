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
};

