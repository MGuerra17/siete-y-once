import { createInitialState, type GameOutcome, type GameState } from "@seven/game-core";
import {
  describeOutcomes,
  describePrompt,
  isRollOutcome,
  mustAutoKeepBet,
} from "@/src/features/game/model/messages";

const names = { player1: "Ana", player2: "Beto" } as const;
const nameOf = (id: keyof typeof names) => names[id];

describe("describeOutcomes", () => {
  it("announces the round winner with the right message per reason", () => {
    const outcomes: GameOutcome[] = [
      {
        kind: "ROUND_WON",
        reason: "SEVEN_OUT",
        result: { winnerId: "player2", winningSum: 7, amount: 100_000 },
      },
    ];
    expect(describeOutcomes(outcomes, createInitialState(), nameOf)).toEqual({
      key: "game.toast.bettorWinsSeven",
      params: { name: "Beto", sum: 7, amount: 100_000 },
    });
  });

  it("uses the last meaningful outcome as the headline", () => {
    const outcomes: GameOutcome[] = [
      { kind: "INITIAL_ROLL_RECORDED", playerId: "player2", sum: 9 },
      { kind: "SHOOTER_DECIDED", shooterId: "player2" },
    ];
    expect(describeOutcomes(outcomes, createInitialState(), nameOf)?.key).toBe(
      "game.toast.shooterDetermined",
    );
  });

  it("returns null when nothing is worth saying", () => {
    expect(describeOutcomes([{ kind: "BET_LOCK_CHANGED", locked: true }], createInitialState(), nameOf)).toBeNull();
  });
});

describe("describePrompt", () => {
  it("asks the bettor to bet and the shooter to roll", () => {
    const betting: GameState = { ...createInitialState(), phase: "BET_PLACEMENT", shooterId: "player1" };
    expect(describePrompt(betting, nameOf)).toEqual({ key: "game.toast.placeBet", params: { name: "Beto" } });
    expect(describePrompt({ ...betting, phase: "SHOOTER_ROLLING" }, nameOf)).toEqual({
      key: "game.toast.shooterRoll",
      params: { name: "Ana" },
    });
  });
});

describe("helpers", () => {
  it("detects roll outcomes", () => {
    expect(isRollOutcome([{ kind: "POINT_SET", point: 6 }])).toBe(true);
    expect(isRollOutcome([{ kind: "BET_PLACED", amount: 50_000 }])).toBe(false);
  });

  it("auto-keeps only in the point phase once the bet reached the cap", () => {
    const state: GameState = { ...createInitialState(), phase: "POINT_PHASE", currentBet: 300_000 };
    expect(mustAutoKeepBet(state, 300_000)).toBe(true);
    expect(mustAutoKeepBet(state, 350_000)).toBe(false);
    expect(mustAutoKeepBet({ ...state, phase: "BET_PLACEMENT" }, 300_000)).toBe(false);
  });
});
