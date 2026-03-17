import { GamePhase } from "../enums/GamePhase";
import { PlayerRole } from "../enums/PlayerRole";
import type { GameState } from "../types/game";
import { applyRoundWin, checkGameOver, resetForNewRound, startNextRound } from "./round-resolution";

const now = new Date().toISOString();

function makePlayer(
  id: "player1" | "player2",
  currentMoney: number,
  role: PlayerRole = PlayerRole.BETTER
): GameState["player1"] {
  return {
    id,
    displayName: id,
    connectionId: "c",
    rejoinToken: "t",
    currentMoney,
    currentRole: role,
    winningNumbers: [],
    isActive: false,
  };
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    gameId: "g1",
    shortCode: "TEST01",
    status: "IN_PROGRESS",
    phase: GamePhase.BET_PLACEMENT,
    player1: makePlayer("player1", 1_000_000),
    player2: makePlayer("player2", 1_000_000),
    shooterId: "player1",
    bettorId: "player2",
    currentBet: 50_000,
    minBet: 50_000,
    keepBet: false,
    point: null,
    diceValues: [1, 1],
    totalRounds: 0,
    initialRolls: {},
    activeInitialRollerId: null,
    lastWinnerId: null,
    lastWinningNumber: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("round-resolution", () => {
  describe("applyRoundWin", () => {
    it("updates money and last winner", () => {
      const state = makeState();
      const next = applyRoundWin(state, "player1", 7);
      expect(next.player1.currentMoney).toBe(1_050_000);
      expect(next.player2!.currentMoney).toBe(950_000);
      expect(next.lastWinnerId).toBe("player1");
      expect(next.lastWinningNumber).toBe(7);
    });
  });

  describe("checkGameOver", () => {
    it("returns true when player1 is broke", () => {
      const state = makeState({
        player1: makePlayer("player1", 30_000),
      });
      expect(checkGameOver(state)).toBe(true);
    });

    it("returns true when player2 is broke", () => {
      const state = makeState({
        player2: makePlayer("player2", 40_000),
      });
      expect(checkGameOver(state)).toBe(true);
    });

    it("returns false when both have enough", () => {
      const state = makeState();
      expect(checkGameOver(state)).toBe(false);
    });
  });

  describe("resetForNewRound", () => {
    it("sets winner as new shooter, other as bettor", () => {
      const state = makeState();
      const next = resetForNewRound(state, "player2");
      expect(next.shooterId).toBe("player2");
      expect(next.bettorId).toBe("player1");
      expect(next.point).toBeNull();
      expect(next.currentBet).toBe(0);
      expect(next.player2!.currentRole).toBe(PlayerRole.ROLLER);
      expect(next.player1.currentRole).toBe(PlayerRole.BETTER);
    });
  });

  describe("startNextRound", () => {
    it("increments rounds and goes to BET_PLACEMENT when no game over", () => {
      const state = makeState();
      const next = startNextRound(state, "player1");
      expect(next.totalRounds).toBe(1);
      expect(next.phase).toBe(GamePhase.BET_PLACEMENT);
      expect(next.status).toBe("IN_PROGRESS");
    });

    it("sets GAME_OVER when a player is broke after round", () => {
      const state = makeState({
        player1: makePlayer("player1", 50_000),
        player2: makePlayer("player2", 50_000),
        currentBet: 50_000,
      });
      const afterWin = applyRoundWin(state, "player1", 7);
      const next = startNextRound(afterWin, "player1");
      expect(next.phase).toBe(GamePhase.GAME_OVER);
      expect(next.status).toBe("GAME_OVER");
    });
  });
});
