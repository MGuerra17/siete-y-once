import type { Player, PlayerId } from "../types/game";

/** Returns the opposing player id. */
export function getOpponentId(playerId: PlayerId): PlayerId {
  return playerId === "player1" ? "player2" : "player1";
}

/** Returns true when a player can no longer afford the minimum bet. */
export function isPlayerBroke(money: number, minBet: number): boolean {
  return money < minBet;
}

/**
 * Applies round result: loser pays winner. Payout is capped at loser's money.
 * Returns new player objects (does not mutate).
 */
export function applyRoundResult(
  winnerId: PlayerId,
  bet: number,
  player1: Player,
  player2: Player
): { player1: Player; player2: Player } {
  const loserId: PlayerId = winnerId === "player1" ? "player2" : "player1";
  const loser = winnerId === "player1" ? player2 : player1;
  const actualPayout = Math.min(bet, loser.currentMoney);

  const winnerUpdate: Player = {
    ...(winnerId === "player1" ? player1 : player2),
    currentMoney: (winnerId === "player1" ? player1 : player2).currentMoney + actualPayout,
  };
  const loserUpdate: Player = {
    ...loser,
    currentMoney: loser.currentMoney - actualPayout,
  };

  return {
    player1: winnerId === "player1" ? winnerUpdate : loserUpdate,
    player2: winnerId === "player2" ? winnerUpdate : loserUpdate,
  };
}
