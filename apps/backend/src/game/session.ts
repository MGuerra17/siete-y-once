import {
  GamePhase,
  RECONNECT_GRACE_MS,
  TURN_TIMEOUT_MS,
  createInitialState,
  getDefaultAction,
  getOpponentId,
  reduce,
  type Dice,
  type GameAction,
  type GameErrorCode,
  type GameOutcome,
  type GameState,
  type PlayerId,
} from "@seven/game-core";
import type { ErrorCode, GameStatus, PublicGame, PublicPlayer } from "@seven/protocol";

/**
 * Extra time on top of the visible turn timer, covering the dice and result animations
 * the client plays before its countdown starts.
 */
export const TURN_PRESENTATION_BUFFER_MS = 3_000;

/** Tolerance for clients whose countdown finishes slightly before the server deadline. */
export const TURN_TIMEOUT_TOLERANCE_MS = 1_500;

/** Unfinished games are deleted by DynamoDB TTL after this long without activity. */
export const GAME_TTL_SECONDS = 24 * 60 * 60;

export interface ServerPlayer {
  displayName: string;
  connectionId: string | null;
  disconnectedAt: number | null;
  /** SHA-256 of the rejoin token; the token itself is only ever sent to its owner. */
  rejoinTokenHash: string;
}

/** Persisted game record (one DynamoDB item). */
export interface ServerGame {
  gameId: string;
  shortCode: string;
  status: GameStatus;
  state: GameState;
  players: { player1: ServerPlayer; player2: ServerPlayer | null };
  turnDeadline: number | null;
  version: number;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}

export type SessionResult =
  | { ok: true; game: ServerGame; outcomes: GameOutcome[] }
  | { ok: false; error: ErrorCode };

const coreErrorToCode: Record<GameErrorCode, ErrorCode> = {
  GAME_OVER: "WRONG_PHASE",
  WRONG_PHASE: "WRONG_PHASE",
  NOT_YOUR_TURN: "NOT_YOUR_TURN",
  INVALID_DICE: "BAD_REQUEST",
  INVALID_BET: "INVALID_BET",
};

const fail = (error: ErrorCode): SessionResult => ({ ok: false, error });

/** Bumps version and timestamps; recomputes the turn deadline. */
function touch(game: ServerGame, now: number, resetTurn: boolean): ServerGame {
  const isRunning = game.status === "IN_PROGRESS" && game.state.phase !== GamePhase.GAME_OVER;
  const turnDeadline = !isRunning
    ? null
    : resetTurn || game.turnDeadline === null
      ? now + TURN_TIMEOUT_MS + TURN_PRESENTATION_BUFFER_MS
      : game.turnDeadline;
  return {
    ...game,
    turnDeadline,
    version: game.version + 1,
    updatedAt: now,
    expiresAt: Math.floor(now / 1000) + GAME_TTL_SECONDS,
  };
}

const withStatusFromState = (game: ServerGame): ServerGame =>
  game.state.phase === GamePhase.GAME_OVER ? { ...game, status: "GAME_OVER" } : game;

export function createServerGame(params: {
  gameId: string;
  shortCode: string;
  connectionId: string;
  displayName: string;
  rejoinTokenHash: string;
  now: number;
}): ServerGame {
  const { gameId, shortCode, connectionId, displayName, rejoinTokenHash, now } = params;
  return {
    gameId,
    shortCode,
    status: "WAITING_PLAYER",
    state: createInitialState(),
    players: {
      player1: { displayName, connectionId, disconnectedAt: null, rejoinTokenHash },
      player2: null,
    },
    turnDeadline: null,
    version: 0,
    createdAt: now,
    updatedAt: now,
    expiresAt: Math.floor(now / 1000) + GAME_TTL_SECONDS,
  };
}

export function joinServerGame(
  game: ServerGame,
  player: { connectionId: string; displayName: string; rejoinTokenHash: string },
  now: number,
): SessionResult {
  if (game.status !== "WAITING_PLAYER" || game.players.player2) return fail("GAME_FULL");
  const joined: ServerGame = {
    ...game,
    status: "IN_PROGRESS",
    players: { ...game.players, player2: { ...player, disconnectedAt: null } },
  };
  return { ok: true, game: touch(joined, now, true), outcomes: [] };
}

export function findPlayerByConnection(game: ServerGame, connectionId: string): PlayerId | null {
  if (game.players.player1.connectionId === connectionId) return "player1";
  if (game.players.player2?.connectionId === connectionId) return "player2";
  return null;
}

export function findPlayerByTokenHash(game: ServerGame, tokenHash: string): PlayerId | null {
  if (game.players.player1.rejoinTokenHash === tokenHash) return "player1";
  if (game.players.player2?.rejoinTokenHash === tokenHash) return "player2";
  return null;
}

function updatePlayer(game: ServerGame, playerId: PlayerId, patch: Partial<ServerPlayer>): ServerGame {
  const current = game.players[playerId];
  if (!current) return game;
  return { ...game, players: { ...game.players, [playerId]: { ...current, ...patch } } };
}

/** Applies a game action on behalf of a connected player. */
export function applyPlayerAction(game: ServerGame, action: GameAction, now: number): SessionResult {
  if (game.status !== "IN_PROGRESS") return fail("WRONG_PHASE");
  const result = reduce(game.state, action);
  if (!result.ok) return fail(coreErrorToCode[result.error]);
  const next = withStatusFromState({ ...game, state: result.state });
  // Toggling the bet lock does not hand the turn over, so it keeps the running deadline.
  const resetTurn = action.type !== "SET_BET_LOCK";
  return { ok: true, game: touch(next, now, resetTurn), outcomes: result.outcomes };
}

/** Server-authoritative default action once the active player's turn has expired. */
export function applyTurnTimeout(game: ServerGame, dice: Dice, now: number): SessionResult {
  if (game.status !== "IN_PROGRESS" || game.turnDeadline === null) return fail("WRONG_PHASE");
  if (now < game.turnDeadline - TURN_TIMEOUT_TOLERANCE_MS) return fail("TOO_EARLY");
  const action = getDefaultAction(game.state, dice);
  if (!action) return fail("WRONG_PHASE");
  return applyPlayerAction(game, action, now);
}

export function markDisconnected(game: ServerGame, playerId: PlayerId, now: number): ServerGame {
  const updated = updatePlayer(game, playerId, { connectionId: null, disconnectedAt: now });
  return touch(updated, now, false);
}

export function markReconnected(
  game: ServerGame,
  playerId: PlayerId,
  connectionId: string,
  now: number,
): ServerGame {
  const updated = updatePlayer(game, playerId, { connectionId, disconnectedAt: null });
  return touch(updated, now, false);
}

/** The requester wins if their opponent has been disconnected for longer than the grace period. */
export function claimAbandonment(game: ServerGame, claimantId: PlayerId, now: number): SessionResult {
  if (game.status !== "IN_PROGRESS") return fail("WRONG_PHASE");
  const opponent = game.players[getOpponentId(claimantId)];
  if (!opponent || opponent.disconnectedAt === null) return fail("WRONG_PHASE");
  if (now < opponent.disconnectedAt + RECONNECT_GRACE_MS) return fail("TOO_EARLY");
  return forfeit(game, getOpponentId(claimantId), now);
}

/** Ends the game in favour of the opponent; cancels it if nobody joined yet. */
export function forfeit(game: ServerGame, playerId: PlayerId, now: number): SessionResult {
  if (game.status === "GAME_OVER") return fail("WRONG_PHASE");
  if (game.status === "WAITING_PLAYER") {
    return { ok: true, game: touch({ ...game, status: "GAME_OVER" }, now, false), outcomes: [] };
  }
  return applyPlayerAction(game, { type: "FORFEIT", playerId }, now);
}

const toPublicPlayer = (player: ServerPlayer): PublicPlayer => ({
  displayName: player.displayName,
  connected: player.connectionId !== null,
  reconnectDeadline:
    player.disconnectedAt === null ? null : player.disconnectedAt + RECONNECT_GRACE_MS,
});

/** Strips connection ids and token hashes before anything leaves the server. */
export function toPublicGame(game: ServerGame): PublicGame {
  return {
    gameId: game.gameId,
    shortCode: game.shortCode,
    status: game.status,
    state: game.state,
    players: {
      player1: toPublicPlayer(game.players.player1),
      player2: game.players.player2 ? toPublicPlayer(game.players.player2) : null,
    },
    turnDeadline: game.turnDeadline,
    version: game.version,
  };
}

export const getConnectionIds = (game: ServerGame): string[] =>
  [game.players.player1.connectionId, game.players.player2?.connectionId].filter(
    (id): id is string => typeof id === "string",
  );
