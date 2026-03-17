import { GamePhase } from "../enums/GamePhase";
import { PlayerRole } from "../enums/PlayerRole";
import type { GameState } from "../types/game";
import { applyInitialRoll } from "./initial-roll";

const now = new Date().toISOString();

function makePlayer(
  id: "player1" | "player2",
  isActive: boolean,
  role: PlayerRole = PlayerRole.BETTER
): GameState["player1"] {
  return {
    id,
    displayName: id,
    connectionId: "c",
    rejoinToken: "t",
    currentMoney: 1_000_000,
    currentRole: role,
    winningNumbers: id === "player1" ? [7, 11] : [2, 3, 12],
    isActive,
  };
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    gameId: "g1",
    shortCode: "TEST01",
    status: "IN_PROGRESS",
    phase: GamePhase.INITIAL_ROLL,
    player1: makePlayer("player1", true),
    player2: makePlayer("player2", false),
    shooterId: null,
    bettorId: null,
    currentBet: 0,
    minBet: 50_000,
    keepBet: false,
    point: null,
    diceValues: [1, 1],
    totalRounds: 0,
    initialRolls: {},
    activeInitialRollerId: "player1",
    lastWinnerId: null,
    lastWinningNumber: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("initial-roll", () => {
  describe("applyInitialRoll", () => {
    it("when other has not rolled, switches to other player", () => {
      const state = makeState();
      const next = applyInitialRoll(state, 7);
      expect(next.initialRolls.player1).toBe(7);
      expect(next.activeInitialRollerId).toBe("player2");
      expect(next.player1.isActive).toBe(false);
      expect(next.player2!.isActive).toBe(true);
    });

    it("when both rolled and tie, resets and player1 rolls", () => {
      const state = makeState({
        initialRolls: { player1: 8, player2: 8 },
        activeInitialRollerId: "player2",
      });
      const next = applyInitialRoll(state, 8);
      expect(next.initialRolls).toEqual({});
      expect(next.activeInitialRollerId).toBe("player1");
    });

    it("when both rolled and current wins, sets shooter and goes to BET_PLACEMENT", () => {
      const state = makeState({
        initialRolls: { player1: 6 },
        activeInitialRollerId: "player2",
      });
      const next = applyInitialRoll(state, 10);
      expect(next.phase).toBe(GamePhase.BET_PLACEMENT);
      expect(next.shooterId).toBe("player2");
      expect(next.bettorId).toBe("player1");
      expect(next.player2!.currentRole).toBe(PlayerRole.ROLLER);
      expect(next.player1.currentRole).toBe(PlayerRole.BETTER);
    });

    it("when both rolled and other wins, sets shooter and goes to BET_PLACEMENT", () => {
      const state = makeState({
        initialRolls: { player2: 5 },
        activeInitialRollerId: "player1",
      });
      const next = applyInitialRoll(state, 3);
      expect(next.phase).toBe(GamePhase.BET_PLACEMENT);
      expect(next.shooterId).toBe("player2");
      expect(next.bettorId).toBe("player1");
    });
  });
});
