import { PlayerRole } from "@/src/features/game/enums/PlayerRole";

/** Identifies which player slot (top or bottom of the screen). */
export type PlayerId = "player1" | "player2";

/** Runtime state for a single player within a game session. */
export type Player = {
  id: PlayerId;
  /** Display name chosen by the player; falls back to a default when undefined. */
  name?: string;
  imageUri?: string | null;
  currentMoney: number;
  currentRole: PlayerRole;
  /** Numbers that would win for this player in the current round. */
  winningNumbers: number[];
  /** Whether it is this player's turn to act (roll or bet). */
  isActive: boolean;
};
