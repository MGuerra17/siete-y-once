import type { GameState } from "./game";

/** Client -> Server: message body. */
export interface ClientMessage {
  action: string;
  payload?: Record<string, unknown>;
}

/** Server -> Client: game state update. */
export interface ServerGameStateMessage {
  type: "gameState";
  game: GameState;
  event?: string;
}

/** Server -> Client: error. */
export interface ServerErrorMessage {
  type: "error";
  message: string;
  code?: string;
}

/** Server -> Client: generic. */
export type ServerMessage = ServerGameStateMessage | ServerErrorMessage;
