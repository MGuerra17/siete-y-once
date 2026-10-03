import type { GameOutcome, GameState, PlayerId } from "@seven/game-core";

/** Bump when a breaking change is made to the messages below. */
export const PROTOCOL_VERSION = 2;

export const DISPLAY_NAME_MAX_LENGTH = 20;
export const SHORT_CODE_LENGTH = 6;
/** Excludes look-alike characters (0/O, 1/I/L) so codes are easy to read aloud. */
export const SHORT_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export type GameStatus = "WAITING_PLAYER" | "IN_PROGRESS" | "GAME_OVER";

export interface PublicPlayer {
  displayName: string;
  connected: boolean;
  /** Epoch ms after which the opponent may claim the win; null while connected. */
  reconnectDeadline: number | null;
}

/** Game snapshot broadcast to both players. Never contains secrets such as rejoin tokens. */
export interface PublicGame {
  gameId: string;
  shortCode: string;
  status: GameStatus;
  state: GameState;
  players: { player1: PublicPlayer; player2: PublicPlayer | null };
  /** Epoch ms (server clock) when the active player's turn expires; null when no turn is running. */
  turnDeadline: number | null;
  /** Monotonic revision; clients ignore snapshots older than the one they have. */
  version: number;
}

// ---------------------------------------------------------------------------
// Client -> server
// ---------------------------------------------------------------------------

export type ClientMessage =
  | { action: "ping" }
  | { action: "createGame"; payload: { displayName: string } }
  | { action: "joinGame"; payload: { displayName: string; shortCode: string } }
  | { action: "rejoinGame"; payload: { gameId: string; rejoinToken: string } }
  | { action: "leaveGame" }
  | { action: "initialRoll" }
  | { action: "placeBet"; payload: { amount: number } }
  | { action: "keepBet"; payload?: { lock?: boolean } }
  | { action: "setBetLock"; payload: { locked: boolean } }
  | { action: "rollDice" }
  /** Asks the server to apply the default action once the turn deadline has passed. */
  | { action: "turnTimeout" }
  /** Claims the win once the opponent's reconnect deadline has passed. */
  | { action: "claimAbandonment" };

export type ClientAction = ClientMessage["action"];

// ---------------------------------------------------------------------------
// Server -> client
// ---------------------------------------------------------------------------

export type ServerEvent =
  | "gameCreated"
  | "playerJoined"
  | "rejoined"
  | "playerDisconnected"
  | "playerReconnected"
  | "action"
  | "turnTimeout"
  | "gameOverByAbandonment"
  | "playerLeft";

export type ServerMessage =
  | { type: "pong"; serverTime: number }
  /** Sent only to the player it belongs to; carries the secret needed to reconnect. */
  | {
      type: "session";
      gameId: string;
      shortCode: string;
      playerId: PlayerId;
      rejoinToken: string;
      serverTime: number;
    }
  | {
      type: "gameState";
      event: ServerEvent;
      game: PublicGame;
      /** What the last action produced (rolls, wins…), for toasts, sounds and animations. */
      outcomes: GameOutcome[];
      serverTime: number;
    }
  | { type: "error"; code: ErrorCode; message: string };

export type ErrorCode =
  | "BAD_REQUEST"
  | "NOT_IN_GAME"
  | "ALREADY_IN_GAME"
  | "GAME_NOT_FOUND"
  | "GAME_FULL"
  | "INVALID_REJOIN"
  | "NOT_YOUR_TURN"
  | "WRONG_PHASE"
  | "INVALID_BET"
  | "TOO_EARLY"
  | "CONFLICT"
  | "INTERNAL";
