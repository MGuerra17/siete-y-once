import { GamePhase } from "../enums/GamePhase";
import { PlayerRole } from "../enums/PlayerRole";
import type { GameState } from "../types/game";
import type { PlayerId } from "../types/game";
import { getOpponentId } from "../utils/game";

/**
 * After one player has rolled in INITIAL_ROLL, switch to the other player's turn.
 * Call when the other player has not rolled yet.
 */
export function switchToOtherPlayerRoll(state: GameState): GameState {
  const activeId = state.activeInitialRollerId!;
  const otherId = getOpponentId(activeId);
  const p1 = state.player1;
  const p2 = state.player2!;
  return {
    ...state,
    activeInitialRollerId: otherId,
    player1: { ...p1, isActive: p1.id === otherId },
    player2: { ...p2, isActive: p2.id === otherId },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Resolve tie: clear initial rolls and set player1 to roll first again.
 */
export function resolveInitialRollTie(state: GameState): GameState {
  const p1 = state.player1;
  const p2 = state.player2!;
  return {
    ...state,
    initialRolls: {},
    activeInitialRollerId: "player1",
    player1: { ...p1, isActive: true },
    player2: { ...p2, isActive: false },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Both players have rolled; determine shooter (higher sum wins) and transition to BET_PLACEMENT.
 */
export function resolveShooterFromInitialRolls(state: GameState): GameState {
  const sum1 = state.initialRolls.player1 ?? 0;
  const sum2 = state.initialRolls.player2 ?? 0;
  const shooterId: PlayerId = sum1 > sum2 ? "player1" : "player2";
  const bettorId = getOpponentId(shooterId);

  const p1 = state.player1;
  const p2 = state.player2!;

  return {
    ...state,
    phase: GamePhase.BET_PLACEMENT,
    shooterId,
    bettorId,
    player1: {
      ...p1,
      currentRole: p1.id === shooterId ? PlayerRole.ROLLER : PlayerRole.BETTER,
      isActive: p1.id === bettorId,
      winningNumbers: p1.id === shooterId ? [7, 11] : [2, 3, 12],
    },
    player2: {
      ...p2,
      currentRole: p2.id === shooterId ? PlayerRole.ROLLER : PlayerRole.BETTER,
      isActive: p2.id === bettorId,
      winningNumbers: p2.id === shooterId ? [7, 11] : [2, 3, 12],
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Record the current active roller's initial roll sum.
 * Returns new state. If the other player has already rolled, compares and either
 * resolves tie, switches turn, or resolves shooter.
 */
export function applyInitialRoll(
  state: GameState,
  sum: number
): GameState {
  const activeId = state.activeInitialRollerId!;
  const otherId = getOpponentId(activeId);
  const initialRolls = { ...state.initialRolls, [activeId]: sum };

  const otherSum = state.initialRolls[otherId];
  if (otherSum === undefined) {
    return switchToOtherPlayerRoll({ ...state, initialRolls, updatedAt: new Date().toISOString() });
  }

  if (sum === otherSum) {
    return resolveInitialRollTie({ ...state, initialRolls, updatedAt: new Date().toISOString() });
  }

  return resolveShooterFromInitialRolls({ ...state, initialRolls, updatedAt: new Date().toISOString() });
}
