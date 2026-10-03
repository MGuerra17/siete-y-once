import { GamePhase } from "../enums/GamePhase";
import { RoundOutcome } from "../enums/RoundOutcome";
import type { GameState } from "../types/game";
import type { PlayerId } from "../types/game";
import { evaluateFirstRoll, evaluateSubsequentRoll } from "../utils/evaluate";
import { applyRoundWin, startNextRound } from "./round-resolution";

/**
 * Set bet and transition to shooter's roll (come-out or point roll).
 */
export function placeBet(
  state: GameState,
  amount: number
): GameState {
  const phase = state.phase === GamePhase.BET_PLACEMENT
    ? GamePhase.SHOOTER_ROLLING
    : GamePhase.WAITING_FOR_ROLL;
  return {
    ...state,
    currentBet: amount,
    phase,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Bettor keeps bet; transition to WAITING_FOR_ROLL so shooter can roll.
 */
export function keepBet(state: GameState): GameState {
  return {
    ...state,
    keepBet: true,
    phase: GamePhase.WAITING_FOR_ROLL,
    updatedAt: new Date().toISOString(),
  };
}

export interface RollResult {
  state: GameState;
  /** If round ended (shooter or bettor won), winnerId and winningNumber. */
  roundEnd?: { winnerId: PlayerId; winningNumber: number };
}

/**
 * Shooter rolls. Evaluates come-out or subsequent roll and returns new state.
 * If round ends, roundEnd is set and state includes next round (or GAME_OVER).
 */
export function shooterRoll(
  state: GameState,
  diceValues: [number, number]
): RollResult {
  const sum = diceValues[0] + diceValues[1];
  const shooterId = state.shooterId!;
  const bettorId = state.bettorId!;

  if (state.phase === GamePhase.SHOOTER_ROLLING) {
    const outcome = evaluateFirstRoll(sum);

    if (outcome === RoundOutcome.SHOOTER_WINS_NATURAL) {
      const withWin = applyRoundWin(state, shooterId, sum);
      const next = startNextRound(withWin, shooterId);
      return { state: { ...next, diceValues }, roundEnd: { winnerId: shooterId, winningNumber: sum } };
    }
    if (outcome === RoundOutcome.BETTOR_WINS_CRAPS) {
      const withWin = applyRoundWin(state, bettorId, sum);
      const next = startNextRound(withWin, bettorId);
      return { state: { ...next, diceValues }, roundEnd: { winnerId: bettorId, winningNumber: sum } };
    }

    // POINT_SET
    const p1 = state.player1;
    const p2 = state.player2!;
    return {
      state: {
        ...state,
        phase: GamePhase.POINT_PHASE,
        point: sum,
        diceValues,
        player1: { ...p1, winningNumbers: p1.id === shooterId ? [sum] : [7] },
        player2: { ...p2, winningNumbers: p2.id === shooterId ? [sum] : [7] },
        updatedAt: new Date().toISOString(),
      },
    };
  }

  // WAITING_FOR_ROLL (point phase)
  const point = state.point!;
  const outcome = evaluateSubsequentRoll(sum, point);

  if (outcome === RoundOutcome.SHOOTER_WINS_POINT) {
    const withWin = applyRoundWin(state, shooterId, sum);
    const next = startNextRound(withWin, shooterId);
    return { state: { ...next, diceValues }, roundEnd: { winnerId: shooterId, winningNumber: sum } };
  }
  if (outcome === RoundOutcome.BETTOR_WINS_SEVEN) {
    const withWin = applyRoundWin(state, bettorId, sum);
    const next = startNextRound(withWin, bettorId);
    return { state: { ...next, diceValues }, roundEnd: { winnerId: bettorId, winningNumber: sum } };
  }

  // CONTINUE: stay in point phase, bettor can keep or raise
  const p1 = state.player1;
  const p2 = state.player2!;
  return {
    state: {
      ...state,
      phase: GamePhase.POINT_PHASE,
      diceValues,
      player1: { ...p1, winningNumbers: p1.id === shooterId ? [point] : [7] },
      player2: { ...p2, winningNumbers: p2.id === shooterId ? [point] : [7] },
      updatedAt: new Date().toISOString(),
    },
  };
}
