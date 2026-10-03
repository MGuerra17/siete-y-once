import { BET_STEPS, CRAPS_SUMS, MIN_BET, NATURAL_SUMS, SEVEN_OUT_SUM } from "./constants";
import { GamePhase, PlayerRole, type GameState, type PlayerId } from "./types";

export const getOpponentId = (playerId: PlayerId): PlayerId =>
  playerId === "player1" ? "player2" : "player1";

export const getBettorId = (state: GameState): PlayerId | null =>
  state.shooterId ? getOpponentId(state.shooterId) : null;

export const getRole = (state: GameState, playerId: PlayerId): PlayerRole | null => {
  if (!state.shooterId) return null;
  return state.shooterId === playerId ? PlayerRole.SHOOTER : PlayerRole.BETTOR;
};

/** The player expected to act next, or null when the game is over. */
export const getActivePlayerId = (state: GameState): PlayerId | null => {
  switch (state.phase) {
    case GamePhase.INITIAL_ROLL:
      return state.initialRolls.player1 === undefined ? "player1" : "player2";
    case GamePhase.BET_PLACEMENT:
    case GamePhase.POINT_PHASE:
      return getBettorId(state);
    case GamePhase.SHOOTER_ROLLING:
    case GamePhase.WAITING_FOR_ROLL:
      return state.shooterId;
    case GamePhase.GAME_OVER:
      return null;
  }
};

/** Sums that would win the round for the given player at this moment. */
export const getWinningNumbers = (state: GameState, playerId: PlayerId): readonly number[] => {
  const role = getRole(state, playerId);
  if (!role || state.phase === GamePhase.GAME_OVER) return [];
  if (state.point === null) {
    return role === PlayerRole.SHOOTER ? NATURAL_SUMS : CRAPS_SUMS;
  }
  return role === PlayerRole.SHOOTER ? [state.point] : [SEVEN_OUT_SUM];
};

/** A bet can never exceed what either player can cover: the lower of the two balances. */
export const getMaxBet = (state: GameState): number =>
  Math.min(state.money.player1, state.money.player2);

/** Opening bets start at the minimum; raises during the point phase start at the current bet. */
export const getMinAllowedBet = (state: GameState): number =>
  state.phase === GamePhase.POINT_PHASE ? Math.max(state.currentBet, MIN_BET) : MIN_BET;

export const isValidBetAmount = (state: GameState, amount: number): boolean =>
  Number.isInteger(amount) &&
  amount % BET_STEPS[0] === 0 &&
  amount >= getMinAllowedBet(state) &&
  amount <= getMaxBet(state);

export const isBroke = (money: number): boolean => money < MIN_BET;
