import { rollDie, rollDice, diceSum } from "./dice";

describe("dice", () => {
  describe("rollDie", () => {
    it("returns a number between 1 and 6 inclusive", () => {
      for (let i = 0; i < 50; i++) {
        const value = rollDie();
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(6);
        expect(Number.isInteger(value)).toBe(true);
      }
    });
  });

  describe("rollDice", () => {
    it("returns a tuple of two numbers", () => {
      const [d1, d2] = rollDice();
      expect(d1).toBeGreaterThanOrEqual(1);
      expect(d1).toBeLessThanOrEqual(6);
      expect(d2).toBeGreaterThanOrEqual(1);
      expect(d2).toBeLessThanOrEqual(6);
    });
  });

  describe("diceSum", () => {
    it("returns the sum of two dice values", () => {
      expect(diceSum([1, 1])).toBe(2);
      expect(diceSum([6, 6])).toBe(12);
      expect(diceSum([3, 4])).toBe(7);
    });
  });
});
