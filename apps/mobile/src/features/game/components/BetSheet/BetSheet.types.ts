import type { Player } from "@/src/features/game/types";

export type BetSheetProps = {
  visible: boolean;
  /** The bettor (name shown in the title). */
  player: Player | null;
  playerName: string;
  currentBet: number;
  minBet: number;
  maxBet: number;
  isFirstBet: boolean;
  point: number | null;
  betLocked: boolean;
  canToggleLock: boolean;
  onToggleLock: () => void;
  onSubmitBet: (bet: number) => void;
};
