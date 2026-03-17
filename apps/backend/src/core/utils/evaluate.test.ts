import { RoundOutcome } from "../enums/RoundOutcome";
import { evaluateFirstRoll, evaluateSubsequentRoll } from "./evaluate";

describe("evaluate", () => {
  describe("evaluateFirstRoll", () => {
    it("returns SHOOTER_WINS_NATURAL for 7 and 11", () => {
      expect(evaluateFirstRoll(7)).toBe(RoundOutcome.SHOOTER_WINS_NATURAL);
      expect(evaluateFirstRoll(11)).toBe(RoundOutcome.SHOOTER_WINS_NATURAL);
    });

    it("returns BETTOR_WINS_CRAPS for 2, 3, 12", () => {
      expect(evaluateFirstRoll(2)).toBe(RoundOutcome.BETTOR_WINS_CRAPS);
      expect(evaluateFirstRoll(3)).toBe(RoundOutcome.BETTOR_WINS_CRAPS);
      expect(evaluateFirstRoll(12)).toBe(RoundOutcome.BETTOR_WINS_CRAPS);
    });

    it("returns POINT_SET for 4, 5, 6, 8, 9, 10", () => {
      expect(evaluateFirstRoll(4)).toBe(RoundOutcome.POINT_SET);
      expect(evaluateFirstRoll(5)).toBe(RoundOutcome.POINT_SET);
      expect(evaluateFirstRoll(6)).toBe(RoundOutcome.POINT_SET);
      expect(evaluateFirstRoll(8)).toBe(RoundOutcome.POINT_SET);
      expect(evaluateFirstRoll(9)).toBe(RoundOutcome.POINT_SET);
      expect(evaluateFirstRoll(10)).toBe(RoundOutcome.POINT_SET);
    });
  });

  describe("evaluateSubsequentRoll", () => {
    it("returns SHOOTER_WINS_POINT when sum matches point", () => {
      expect(evaluateSubsequentRoll(5, 5)).toBe(RoundOutcome.SHOOTER_WINS_POINT);
      expect(evaluateSubsequentRoll(9, 9)).toBe(RoundOutcome.SHOOTER_WINS_POINT);
    });

    it("returns BETTOR_WINS_SEVEN when sum is 7", () => {
      expect(evaluateSubsequentRoll(7, 4)).toBe(RoundOutcome.BETTOR_WINS_SEVEN);
      expect(evaluateSubsequentRoll(7, 10)).toBe(RoundOutcome.BETTOR_WINS_SEVEN);
    });

    it("returns CONTINUE for other sums", () => {
      expect(evaluateSubsequentRoll(3, 5)).toBe(RoundOutcome.CONTINUE);
      expect(evaluateSubsequentRoll(8, 4)).toBe(RoundOutcome.CONTINUE);
    });
  });
});
