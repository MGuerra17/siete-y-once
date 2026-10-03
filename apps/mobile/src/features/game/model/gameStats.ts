import type { PlayerId, RoundResult } from "@seven/game-core";

/** What the game-over screen reports beyond the final money. Keyed by rules player id. */
export type GameStats = {
  roundsWon: Record<PlayerId, number>;
  biggestBet: number;
};

export const emptyGameStats = (): GameStats => ({
  roundsWon: { player1: 0, player2: 0 },
  biggestBet: 0,
});

/** Adds one decided round. Pure, so both modes feed it the same way. */
export const recordRound = (
  stats: GameStats,
  result: Pick<RoundResult, "winnerId" | "amount">,
): GameStats => ({
  roundsWon: { ...stats.roundsWon, [result.winnerId]: stats.roundsWon[result.winnerId] + 1 },
  biggestBet: Math.max(stats.biggestBet, result.amount),
});
