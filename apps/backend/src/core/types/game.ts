import { PlayerRole } from "../enums/PlayerRole";

/** Identifies which player slot (player1 or player2). */
export type PlayerId = "player1" | "player2";

/** Runtime state for a single player within a game session. */
export interface Player {
  id: PlayerId;
  /** Display name chosen by the player. */
  displayName: string;
  /** Current WebSocket connection ID; null when disconnected. */
  connectionId: string | null;
  /** ISO timestamp when connectionId was set to null; used for abandonment timeout. */
  disconnectedAt?: string | null;
  /** Opaque token for reconnecting to this slot. */
  rejoinToken: string;
  currentMoney: number;
  currentRole: PlayerRole;
  /** Numbers that would win for this player in the current round. */
  winningNumbers: number[];
  /** Whether it is this player's turn to act (roll or bet). */
  isActive: boolean;
}

/** Game status for DynamoDB/lifecycle. */
export type GameStatus = "WAITING_PLAYER" | "IN_PROGRESS" | "GAME_OVER";

/** Full game state (in-memory / API shape). */
export interface GameState {
  gameId: string;
  /** Short code (e.g. 6 chars) for sharing; used to join via joinGame with code. */
  shortCode: string;
  status: GameStatus;
  phase: string;
  player1: Player;
  player2: Player | null;
  shooterId: PlayerId | null;
  bettorId: PlayerId | null;
  currentBet: number;
  minBet: number;
  keepBet: boolean;
  point: number | null;
  diceValues: [number, number];
  totalRounds: number;
  initialRolls: Partial<Record<PlayerId, number>>;
  activeInitialRollerId: PlayerId | null;
  lastWinnerId: PlayerId | null;
  lastWinningNumber: number | null;
  createdAt: string;
  updatedAt: string;
}
