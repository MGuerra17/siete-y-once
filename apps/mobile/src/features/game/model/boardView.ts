import {
  GamePhase,
  getActivePlayerId,
  getBettorId,
  getMaxBet,
  getMinAllowedBet,
  getOpponentId,
  getRole,
  getWinningNumbers,
  type GameEndReason,
  type GameState,
  type PlayerId,
} from "@seven/game-core";
import type { GameStats } from "@/src/features/game/model/gameStats";
import type { Player } from "@/src/features/game/types";

/** Everything the board renders, expressed in seats (player1 = bottom, player2 = top). */
export type BoardView = {
  phase: GamePhase;
  player1: Player;
  player2: Player;
  point: number | null;
  diceValues: [number, number];
  initialRolls: Partial<Record<PlayerId, number>>;
  currentBet: number;
  bettorId: PlayerId | null;
  activePlayerId: PlayerId | null;
  betLocked: boolean;
  minBet: number;
  maxBet: number;
  isFirstBet: boolean;
  totalRounds: number;
  winner: Player | null;
  loser: Player | null;
  endReason: GameEndReason | null;
};

export type BoardViewOptions = {
  /** Rules id of the player sitting at the bottom of the screen. */
  localPlayerId: PlayerId;
  /** Display names by rules id. */
  names: Partial<Record<PlayerId, string>>;
};

/** Maps rules ids to seats so the local player is always drawn at the bottom. */
export const createSeatMapper = (localPlayerId: PlayerId) => ({
  toSeat: (playerId: PlayerId): PlayerId => (playerId === localPlayerId ? "player1" : "player2"),
  toPlayerId: (seat: PlayerId): PlayerId =>
    seat === "player1" ? localPlayerId : getOpponentId(localPlayerId),
});

/** Pure projection of the rules state into what the board components need. */
export function buildBoardView(state: GameState, options: BoardViewOptions): BoardView {
  const { toSeat, toPlayerId } = createSeatMapper(options.localPlayerId);
  const activeId = getActivePlayerId(state);
  const bettorId = getBettorId(state);

  const playerAt = (seat: PlayerId): Player => {
    const id = toPlayerId(seat);
    return {
      id: seat,
      name: options.names[id],
      currentMoney: state.money[id],
      currentRole: getRole(state, id),
      winningNumbers: getWinningNumbers(state, id),
      isActive: activeId === id,
    };
  };

  const player1 = playerAt("player1");
  const player2 = playerAt("player2");
  const initialRolls: BoardView["initialRolls"] = {};
  for (const id of ["player1", "player2"] as const) {
    const sum = state.initialRolls[id];
    if (sum !== undefined) initialRolls[toSeat(id)] = sum;
  }

  const winnerSeat = state.winnerId ? toSeat(state.winnerId) : null;
  const isBetting = state.phase === GamePhase.BET_PLACEMENT;

  return {
    phase: state.phase,
    player1,
    player2,
    point: state.point,
    diceValues: state.dice ? [state.dice[0], state.dice[1]] : [1, 1],
    initialRolls,
    currentBet: state.currentBet,
    bettorId: bettorId ? toSeat(bettorId) : null,
    activePlayerId: activeId ? toSeat(activeId) : null,
    betLocked: state.betLocked,
    minBet: getMinAllowedBet(state),
    maxBet: getMaxBet(state),
    isFirstBet: isBetting || state.currentBet === 0,
    totalRounds: state.round,
    winner: winnerSeat ? (winnerSeat === "player1" ? player1 : player2) : null,
    loser: winnerSeat ? (winnerSeat === "player1" ? player2 : player1) : null,
    endReason: state.endReason,
  };
}

/** Re-keys stats (by rules id) to seats, so the end screen can read the local player's numbers. */
export function statsInSeats(stats: GameStats, localPlayerId: PlayerId): GameStats {
  const { toPlayerId } = createSeatMapper(localPlayerId);
  return {
    biggestBet: stats.biggestBet,
    roundsWon: {
      player1: stats.roundsWon[toPlayerId("player1")],
      player2: stats.roundsWon[toPlayerId("player2")],
    },
  };
}
