import type { PlayerId, PlayerRole } from "@seven/game-core";

export type { PlayerId };

export const GameModes = {
  OFFLINE: "offline",
  ONLINE: "online",
} as const;
export type GameMode = (typeof GameModes)[keyof typeof GameModes];

/**
 * A player as drawn on the board. `id` is the seat, not the rules id:
 * `player1` is the bottom seat (the local player online), `player2` the top one.
 */
export type Player = {
  id: PlayerId;
  name?: string;
  imageUri?: string | null;
  currentMoney: number;
  /** Null before the initial roll decides the shooter. */
  currentRole: PlayerRole | null;
  winningNumbers: readonly number[];
  isActive: boolean;
};

/** The winning sum flying towards the round winner's seat. `key` restarts the animation. */
export type Flyer = { playerId: PlayerId; number: number; key: number };

/** Moments the UI reacts to with sounds or haptics. `mine` is true when the local player benefits. */
export type GameEvent =
  | { type: "roll" }
  | { type: "bet" }
  | { type: "roundWon"; mine: boolean }
  | { type: "gameOver"; mine: boolean };
