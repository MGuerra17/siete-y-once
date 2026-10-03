import type { PlayerId } from "@/src/features/game/types";

/** Player shape as returned by the backend. */
export interface ServerPlayer {
  id: PlayerId;
  displayName: string;
  connectionId: string | null;
  disconnectedAt?: string | null;
  rejoinToken: string;
  currentMoney: number;
  currentRole: string;
  winningNumbers: number[];
  isActive: boolean;
}

export type GameStatus = "WAITING_PLAYER" | "IN_PROGRESS" | "GAME_OVER";

/** Full game state as returned by the backend in every gameState message. */
export interface ServerGameState {
  gameId: string;
  shortCode: string;
  status: GameStatus;
  phase: string;
  player1: ServerPlayer;
  player2: ServerPlayer | null;
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

export type ServerGameStateEvent =
  | "displayNameSet"
  | "gameCreated"
  | "playerJoined"
  | "joined"
  | "rejoined"
  | "playerReconnected"
  | "initialRoll"
  | "betPlaced"
  | "keepBet"
  | "roll"
  | "roundEnd"
  | "playerDisconnected"
  | "gameOverByAbandonment";

export interface RoundEndInfo {
  winnerId: PlayerId;
  outcome: string;
}

export interface ServerGameStateMessage {
  type: "gameState";
  game?: ServerGameState;
  event: ServerGameStateEvent;
  message?: string;
  gameId?: string;
  shortCode?: string;
  rejoinToken?: string;
  roundEnd?: RoundEndInfo;
  winnerId?: PlayerId;
}

export interface ServerErrorMessage {
  type: "error";
  message: string;
}

export type ServerMessage = ServerGameStateMessage | ServerErrorMessage;
