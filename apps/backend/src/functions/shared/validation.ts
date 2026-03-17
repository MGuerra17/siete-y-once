import { GamePhase } from "../../core/enums/GamePhase";
import { ABANDONMENT_TIMEOUT_MS } from "../../core/constants/game.constants";
import type { GameState } from "../../core/types/game";
import type { PlayerId } from "../../core/types/game";

export function getPlayerSlotByConnectionId(
  state: GameState,
  connectionId: string
): PlayerId | null {
  if (state.player1.connectionId === connectionId) return "player1";
  if (state.player2?.connectionId === connectionId) return "player2";
  return null;
}

/**
 * Ensures the connection belongs to this game as one of the two players.
 * Use at the start of every game action; never trust player identity from the request body.
 */
export function requirePlayerInGame(
  state: GameState,
  connectionId: string
): PlayerId | null {
  if (!state.player2) return null;
  return getPlayerSlotByConnectionId(state, connectionId);
}

export function isCurrentPlayerShooter(state: GameState, connectionId: string): boolean {
  const slot = getPlayerSlotByConnectionId(state, connectionId);
  return slot !== null && state.shooterId === slot;
}

export function isCurrentPlayerBettor(state: GameState, connectionId: string): boolean {
  const slot = getPlayerSlotByConnectionId(state, connectionId);
  return slot !== null && state.bettorId === slot;
}

export function canPlaceBet(state: GameState, amount: number): boolean {
  if (state.phase !== GamePhase.BET_PLACEMENT && state.phase !== GamePhase.POINT_PHASE) return false;
  if (amount < state.minBet) return false;
  const bettor = state.bettorId ? state[state.bettorId] : null;
  if (!bettor) return false;
  return amount <= bettor.currentMoney;
}

export function canRoll(state: GameState, connectionId: string): boolean {
  const slot = getPlayerSlotByConnectionId(state, connectionId);
  if (!slot || state.shooterId !== slot) return false;
  return (
    state.phase === GamePhase.SHOOTER_ROLLING ||
    state.phase === GamePhase.WAITING_FOR_ROLL
  );
}

export function canDoInitialRoll(state: GameState, connectionId: string): boolean {
  if (state.phase !== GamePhase.INITIAL_ROLL) return false;
  const slot = getPlayerSlotByConnectionId(state, connectionId);
  return slot !== null && state.activeInitialRollerId === slot;
}

export function canKeepBet(state: GameState, connectionId: string): boolean {
  if (state.phase !== GamePhase.POINT_PHASE) return false;
  return isCurrentPlayerBettor(state, connectionId);
}

export function canRejoin(state: GameState, rejoinToken: string): PlayerId | null {
  if (state.status === "GAME_OVER") return null;
  if (state.player1.rejoinToken === rejoinToken) return "player1";
  if (state.player2?.rejoinToken === rejoinToken) return "player2";
  return null;
}

/**
 * True if the connected player can claim victory by abandonment (opponent disconnected long enough).
 */
export function canClaimAbandonment(state: GameState, connectionId: string): boolean {
  if (state.status === "GAME_OVER" || !state.player2) return false;
  const mySlot = getPlayerSlotByConnectionId(state, connectionId);
  if (!mySlot) return false;
  const opponent = mySlot === "player1" ? state.player2 : state.player1;
  if (opponent.connectionId !== null) return false;
  const disconnectedAt = opponent.disconnectedAt;
  if (!disconnectedAt) return false;
  const elapsed = Date.now() - new Date(disconnectedAt).getTime();
  return elapsed >= ABANDONMENT_TIMEOUT_MS;
}
