import type { Player, PlayerId } from "@/src/features/game/types";

export type GameBoardBottomProps = {
  player: Player;
  isInitialPhase: boolean;
  currentBet: number;
  bettorId: PlayerId | null;
  keepBet: boolean;
  canUnlock: boolean;
  lastWinnerId: PlayerId | null;
  lastWinningNumber: number | null;
  onKeepBetChange: (value: boolean) => void;
  countdownProgress?: number | null;
};

