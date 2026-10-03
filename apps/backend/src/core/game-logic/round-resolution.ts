import { GamePhase } from "../enums/GamePhase";
import { PlayerRole } from "../enums/PlayerRole";
import type { GameState } from "../types/game";
import type { PlayerId } from "../types/game";
import { isPlayerBroke } from "../utils/game";
import { applyRoundResult } from "../utils/game";

/**
 * Apply payout and set last winner. Does not advance phase or round.
 */
export function applyRoundWin(
  state: GameState,
  winnerId: PlayerId,
  winningNumber: number
): GameState {
  const p1 = state.player1;
  const p2 = state.player2!;
  const { player1: newP1, player2: newP2 } = applyRoundResult(
    winnerId,
    state.currentBet,
    p1,
    p2
  );
  return {
    ...state,
    player1: newP1,
    player2: newP2,
    lastWinnerId: winnerId,
    lastWinningNumber: winningNumber,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Check if either player is broke; if so return true and caller should set phase to GAME_OVER.
 */
export function checkGameOver(state: GameState): boolean {
  if (!state.player2) return false;
  return (
    isPlayerBroke(state.player1.currentMoney, state.minBet) ||
    isPlayerBroke(state.player2.currentMoney, state.minBet)
  );
}

/**
 * Reset per-round state and set winner as next shooter (bettor becomes shooter).
 */
export function resetForNewRound(state: GameState, newShooterId: PlayerId): GameState {
  const newBettorId: PlayerId = newShooterId === "player1" ? "player2" : "player1";
  const p1 = state.player1;
  const p2 = state.player2!;

  return {
    ...state,
    point: null,
    currentBet: 0,
    keepBet: false,
    lastWinnerId: null,
    lastWinningNumber: null,
    shooterId: newShooterId,
    bettorId: newBettorId,
    player1: {
      ...p1,
      currentRole: p1.id === newShooterId ? PlayerRole.ROLLER : PlayerRole.BETTER,
      isActive: p1.id === newBettorId,
      winningNumbers: p1.id === newShooterId ? [7, 11] : [2, 3, 12],
    },
    player2: {
      ...p2,
      currentRole: p2.id === newShooterId ? PlayerRole.ROLLER : PlayerRole.BETTER,
      isActive: p2.id === newBettorId,
      winningNumbers: p2.id === newShooterId ? [7, 11] : [2, 3, 12],
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * After a round is won: increment rounds, check game over, then start next round (BET_PLACEMENT).
 */
export function startNextRound(state: GameState, winnerId: PlayerId): GameState {
  const withRounds = { ...state, totalRounds: state.totalRounds + 1, updatedAt: new Date().toISOString() };
  if (checkGameOver(withRounds)) {
    return { ...withRounds, phase: GamePhase.GAME_OVER, status: "GAME_OVER" as const };
  }
  const reset = resetForNewRound(withRounds, winnerId);
  return { ...reset, phase: GamePhase.BET_PLACEMENT };
}
