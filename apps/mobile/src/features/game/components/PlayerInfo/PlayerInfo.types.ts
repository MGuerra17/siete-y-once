import type { PlayerRole } from "@seven/game-core";

export type PlayerInfoVariant = "primary" | "secondary";

export type PlayerInfoProps = {
  id: "player1" | "player2";
  name?: string;
  imageUri?: string | null;
  currentMoney: number;
  /** Null before the shooter is decided (shown as rolling). */
  role: PlayerRole | null;
  winningNumbers: readonly number[];
  isActive: boolean;
  activeWinningNumber?: number | null;
  variant?: PlayerInfoVariant;
};

