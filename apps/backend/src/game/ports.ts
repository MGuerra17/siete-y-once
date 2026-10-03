import type { PlayerId } from "@seven/game-core";
import type { ServerMessage } from "@seven/protocol";
import type { ServerGame } from "./session";

export interface ConnectionRecord {
  connectionId: string;
  gameId: string | null;
  playerId: PlayerId | null;
}

export interface ConnectionsRepository {
  get(connectionId: string): Promise<ConnectionRecord | null>;
  put(record: ConnectionRecord): Promise<void>;
  delete(connectionId: string): Promise<void>;
}

/** Thrown when a conditional write loses a race against a concurrent update. */
export class VersionConflictError extends Error {
  constructor(gameId: string) {
    super(`Version conflict on game ${gameId}`);
    this.name = "VersionConflictError";
  }
}

export interface GamesRepository {
  get(gameId: string): Promise<ServerGame | null>;
  /** Returns the game currently waiting for a second player under this code, if any. */
  findWaitingByShortCode(shortCode: string): Promise<ServerGame | null>;
  create(game: ServerGame): Promise<void>;
  /** Persists `game` only if the stored version equals `game.version - 1`. */
  update(game: ServerGame): Promise<void>;
}

export interface Notifier {
  send(connectionId: string, message: ServerMessage): Promise<void>;
}

export interface Clock {
  now(): number;
}

export interface Ids {
  gameId(): string;
  rejoinToken(): string;
  shortCode(): string;
  hash(value: string): string;
}

export interface Random {
  /** Uniform float in [0, 1). */
  next(): number;
}

export interface Dependencies {
  games: GamesRepository;
  connections: ConnectionsRepository;
  notifier: Notifier;
  clock: Clock;
  ids: Ids;
  random: Random;
}
