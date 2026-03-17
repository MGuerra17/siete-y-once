import { PlayerRole } from "../enums/PlayerRole";
import type { Player } from "../types/game";
import { getOpponentId, isPlayerBroke, applyRoundResult } from "./game";

const makePlayer = (id: "player1" | "player2", currentMoney: number): Player => ({
  id,
  displayName: id,
  connectionId: "conn",
  rejoinToken: "token",
  currentMoney,
  currentRole: PlayerRole.BETTER,
  winningNumbers: [],
  isActive: false,
});

describe("game utils", () => {
  describe("getOpponentId", () => {
    it("returns player2 for player1", () => {
      expect(getOpponentId("player1")).toBe("player2");
    });
    it("returns player1 for player2", () => {
      expect(getOpponentId("player2")).toBe("player1");
    });
  });

  describe("isPlayerBroke", () => {
    it("returns true when money < minBet", () => {
      expect(isPlayerBroke(40_000, 50_000)).toBe(true);
      expect(isPlayerBroke(0, 50_000)).toBe(true);
    });
    it("returns false when money >= minBet", () => {
      expect(isPlayerBroke(50_000, 50_000)).toBe(false);
      expect(isPlayerBroke(100_000, 50_000)).toBe(false);
    });
  });

  describe("applyRoundResult", () => {
    it("transfers bet from loser to winner, capped by loser money", () => {
      const p1 = makePlayer("player1", 1_000_000);
      const p2 = makePlayer("player2", 200_000);
      const { player1, player2 } = applyRoundResult("player1", 100_000, p1, p2);
      expect(player1.currentMoney).toBe(1_100_000);
      expect(player2.currentMoney).toBe(100_000);
    });

    it("caps payout at loser remaining money", () => {
      const p1 = makePlayer("player1", 1_000_000);
      const p2 = makePlayer("player2", 30_000);
      const { player1, player2 } = applyRoundResult("player1", 50_000, p1, p2);
      expect(player1.currentMoney).toBe(1_030_000);
      expect(player2.currentMoney).toBe(0);
    });
  });
});
