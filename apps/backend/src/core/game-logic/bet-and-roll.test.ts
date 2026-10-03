import { GamePhase } from "../enums/GamePhase";
import { PlayerRole } from "../enums/PlayerRole";
import type { GameState } from "../types/game";
import { placeBet, keepBet, shooterRoll } from "./bet-and-roll";

const now = new Date().toISOString();

function makePlayer(
  id: "player1" | "player2",
  role: PlayerRole,
  isActive: boolean,
  winningNumbers: number[]
): GameState["player1"] {
  return {
    id,
    displayName: id,
    connectionId: "c",
    rejoinToken: "t",
    currentMoney: 1_000_000,
    currentRole: role,
    winningNumbers,
    isActive,
  };
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    gameId: "g1",
    shortCode: "TEST01",
    status: "IN_PROGRESS",
    phase: GamePhase.SHOOTER_ROLLING,
    player1: makePlayer("player1", PlayerRole.ROLLER, false, [7, 11]),
    player2: makePlayer("player2", PlayerRole.BETTER, true, [2, 3, 12]),
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

describe("bet-and-roll", () => {
  describe("placeBet", () => {
    it("sets bet and phase to SHOOTER_ROLLING when was BET_PLACEMENT", () => {
      const state = makeState({ phase: GamePhase.BET_PLACEMENT });
      const next = placeBet(state, 100_000);
      expect(next.currentBet).toBe(100_000);
      expect(next.phase).toBe(GamePhase.SHOOTER_ROLLING);
    });

    it("sets phase to WAITING_FOR_ROLL when was POINT_PHASE", () => {
      const state = makeState({ phase: GamePhase.POINT_PHASE });
      const next = placeBet(state, 50_000);
      expect(next.phase).toBe(GamePhase.WAITING_FOR_ROLL);
    });
  });

  describe("keepBet", () => {
    it("sets keepBet and phase to WAITING_FOR_ROLL", () => {
      const state = makeState({ phase: GamePhase.POINT_PHASE });
      const next = keepBet(state);
      expect(next.keepBet).toBe(true);
      expect(next.phase).toBe(GamePhase.WAITING_FOR_ROLL);
    });
  });

  describe("shooterRoll", () => {
    it("on come-out 7, shooter wins and round ends", () => {
      const state = makeState();
      const result = shooterRoll(state, [3, 4]);
      expect(result.roundEnd).toEqual({ winnerId: "player1", winningNumber: 7 });
      expect(result.state.phase).toBe(GamePhase.BET_PLACEMENT);
      expect(result.state.totalRounds).toBe(1);
      expect(result.state.shooterId).toBe("player1");
    });

    it("on come-out 11, shooter wins", () => {
      const state = makeState();
      const result = shooterRoll(state, [5, 6]);
      expect(result.roundEnd?.winnerId).toBe("player1");
    });

    it("on come-out 2, bettor wins", () => {
      const state = makeState();
      const result = shooterRoll(state, [1, 1]);
      expect(result.roundEnd?.winnerId).toBe("player2");
    });

    it("on come-out 5, point is set and phase POINT_PHASE", () => {
      const state = makeState();
      const result = shooterRoll(state, [2, 3]);
      expect(result.roundEnd).toBeUndefined();
      expect(result.state.phase).toBe(GamePhase.POINT_PHASE);
      expect(result.state.point).toBe(5);
    });

    it("on subsequent roll matching point, shooter wins", () => {
      const state = makeState({
        phase: GamePhase.WAITING_FOR_ROLL,
        point: 5,
        player1: makePlayer("player1", PlayerRole.ROLLER, true, [5]),
        player2: makePlayer("player2", PlayerRole.BETTER, false, [7]),
      });
      const result = shooterRoll(state, [2, 3]);
      expect(result.roundEnd).toEqual({ winnerId: "player1", winningNumber: 5 });
    });

    it("on subsequent roll 7, bettor wins", () => {
      const state = makeState({
        phase: GamePhase.WAITING_FOR_ROLL,
        point: 5,
        player1: makePlayer("player1", PlayerRole.ROLLER, true, [5]),
        player2: makePlayer("player2", PlayerRole.BETTER, false, [7]),
      });
      const result = shooterRoll(state, [3, 4]);
      expect(result.roundEnd).toEqual({ winnerId: "player2", winningNumber: 7 });
    });

    it("on subsequent roll neither point nor 7, continues POINT_PHASE", () => {
      const state = makeState({
        phase: GamePhase.WAITING_FOR_ROLL,
        point: 5,
        player1: makePlayer("player1", PlayerRole.ROLLER, true, [5]),
        player2: makePlayer("player2", PlayerRole.BETTER, false, [7]),
      });
      const result = shooterRoll(state, [2, 2]);
      expect(result.roundEnd).toBeUndefined();
      expect(result.state.phase).toBe(GamePhase.POINT_PHASE);
    });
  });
});
