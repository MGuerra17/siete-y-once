import type { Player, PlayerId } from "@/src/features/game/types";

export type GameBoardTopProps = {
  player: Player;
  isInitialPhase: boolean;
  currentBet: number;
  bettorId: PlayerId | null;
  keepBet: boolean;
  canUnlock: boolean;
  lastWinnerId: PlayerId | null;
  lastWinningNumber: number | null;
  onExitPress: () => void;
  onKeepBetChange: (value: boolean) => void;
  /** Whether this seat may toggle the bet lock (online: only the local player). */
  canToggleLock: boolean;
};

