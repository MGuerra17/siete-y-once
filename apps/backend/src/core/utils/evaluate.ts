import {
  BETTOR_CRAPS_WINS,
  SHOOTER_NATURAL_WINS,
} from "../constants/game.constants";
import { RoundOutcome } from "../enums/RoundOutcome";

/**
 * Evaluates the come-out (first) roll of a round.
 * 7 or 11 = natural win for the shooter, 2/3/12 = craps win for the bettor,
 * anything else establishes the point.
 */
export function evaluateFirstRoll(sum: number): RoundOutcome {
  if ((SHOOTER_NATURAL_WINS as readonly number[]).includes(sum)) {
    return RoundOutcome.SHOOTER_WINS_NATURAL;
  }
  if ((BETTOR_CRAPS_WINS as readonly number[]).includes(sum)) {
    return RoundOutcome.BETTOR_WINS_CRAPS;
  }
  return RoundOutcome.POINT_SET;
}

/**
 * Evaluates a roll after the point has been set.
 * Matching the point = shooter wins, rolling 7 = bettor wins, otherwise continue.
 */
export function evaluateSubsequentRoll(
  sum: number,
  point: number
): RoundOutcome {
  if (sum === point) return RoundOutcome.SHOOTER_WINS_POINT;
  if (sum === 7) return RoundOutcome.BETTOR_WINS_SEVEN;
  return RoundOutcome.CONTINUE;
}
