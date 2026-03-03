import {
  BETTOR_CRAPS_WINS,
  SHOOTER_NATURAL_WINS,
} from "@/src/features/game/constants/game.constants";
import { RoundOutcome } from "@/src/features/game/enums/RoundOutcome";

export const rollDie = (): number => Math.floor(Math.random() * 6) + 1;

export const rollDice = (): [number, number] => [rollDie(), rollDie()];

export const evaluateFirstRoll = (sum: number): RoundOutcome => {
  if ((SHOOTER_NATURAL_WINS as readonly number[]).includes(sum)) {
    return RoundOutcome.SHOOTER_WINS_NATURAL;
  }
  if ((BETTOR_CRAPS_WINS as readonly number[]).includes(sum)) {
    return RoundOutcome.BETTOR_WINS_CRAPS;
  }
  return RoundOutcome.POINT_SET;
};

export const evaluateSubsequentRoll = (
  sum: number,
  point: number,
): RoundOutcome => {
  if (sum === point) return RoundOutcome.SHOOTER_WINS_POINT;
  if (sum === 7) return RoundOutcome.BETTOR_WINS_SEVEN;
  return RoundOutcome.CONTINUE;
};

export const isPlayerBroke = (money: number, minBet: number): boolean =>
  money < minBet;

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
