import { createInitialState, reduce, type GameAction, type GameOutcome, type GameState } from "@seven/game-core";
import type { PublicGame, ServerMessage } from "@seven/protocol";

export const play = (state: GameState, ...actions: GameAction[]) =>
  actions.reduce((current, action) => {
    const result = reduce(current, action);
    if (!result.ok) throw new Error(result.error);
    return result.state;
  }, state);

/** player1 ("Ana") won the initial roll and shoots; player2 ("Beto") bets. */
export const bettingState = () =>
  play(
    createInitialState(),
    { type: "INITIAL_ROLL", playerId: "player1", dice: [6, 6] },
    { type: "INITIAL_ROLL", playerId: "player2", dice: [1, 1] },
  );

export const makeGame = (state: GameState, overrides: Partial<PublicGame> = {}): PublicGame => ({
  gameId: "00000000-0000-4000-8000-000000000001",
  shortCode: "ABC234",
  status: "IN_PROGRESS",
  state,
  players: {
    player1: { displayName: "Ana", connected: true, reconnectDeadline: null },
    player2: { displayName: "Beto", connected: true, reconnectDeadline: null },
  },
  turnDeadline: 1_000_000,
  version: 1,
  ...overrides,
});

export const stateMessage = (
  game: PublicGame,
  outcomes: GameOutcome[] = [],
  event: Extract<ServerMessage, { type: "gameState" }>["event"] = "action",
): Extract<ServerMessage, { type: "gameState" }> => ({
  type: "gameState",
  event,
  game,
  outcomes,
  serverTime: 0,
});
