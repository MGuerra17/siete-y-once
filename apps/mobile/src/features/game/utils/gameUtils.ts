import {
  BETTOR_CRAPS_WINS,
  SHOOTER_NATURAL_WINS,
} from "@/src/features/game/constants/game.constants";
import { RoundOutcome } from "@/src/features/game/enums/RoundOutcome";
import type { Player, PlayerId } from "@/src/features/game/types";

const DEFAULT_NAMES: Record<PlayerId, string> = {
  player1: "Player 1",
  player2: "Player 2",
};

/** Returns the display name for a player, falling back to "Player 1" / "Player 2". */
export const getPlayerName = (
  players: { player1: Player; player2: Player },
  playerId: PlayerId,
): string => players[playerId].name || DEFAULT_NAMES[playerId];

/** Returns the opposing player id. */
export const getOpponentId = (playerId: PlayerId): PlayerId =>
  playerId === "player1" ? "player2" : "player1";

/** Determines winner and loser based on current money. Ties favor player1. */
export const getWinnerAndLoser = (
  player1: Player,
  player2: Player,
): { winner: Player; loser: Player } => {
  const winner =
    player1.currentMoney >= player2.currentMoney ? player1 : player2;
  const loser = winner.id === "player1" ? player2 : player1;
  return { winner, loser };
};

/** Returns a random integer between 1 and 6 (inclusive). */
export const rollDie = (): number => Math.floor(Math.random() * 6) + 1;

/** Rolls two dice and returns the pair. */
export const rollDice = (): [number, number] => [rollDie(), rollDie()];

/**
 * Evaluates the come-out (first) roll of a round.
 * 7 or 11 = natural win for the shooter, 2/3/12 = craps win for the bettor,
 * anything else establishes the point.
 */
export const evaluateFirstRoll = (sum: number): RoundOutcome => {
  if ((SHOOTER_NATURAL_WINS as readonly number[]).includes(sum)) {
    return RoundOutcome.SHOOTER_WINS_NATURAL;
  }
  if ((BETTOR_CRAPS_WINS as readonly number[]).includes(sum)) {
    return RoundOutcome.BETTOR_WINS_CRAPS;
  }
  return RoundOutcome.POINT_SET;
};

/**
 * Evaluates a roll after the point has been set.
 * Matching the point = shooter wins, rolling 7 = bettor wins, otherwise continue.
 */
export const evaluateSubsequentRoll = (
  sum: number,
  point: number,
): RoundOutcome => {
  if (sum === point) return RoundOutcome.SHOOTER_WINS_POINT;
  if (sum === 7) return RoundOutcome.BETTOR_WINS_SEVEN;
  return RoundOutcome.CONTINUE;
};

/** Returns true when a player can no longer afford the minimum bet. */
export const isPlayerBroke = (money: number, minBet: number): boolean =>
  money < minBet;

/** Promise-based delay for sequencing async game engine steps. */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
