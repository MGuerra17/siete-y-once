import {
  errorMessageKey,
  isNewer,
  planGameMessage,
  shouldAutoKeepBet,
} from "@/src/features/online/model/presentation";
import { bettingState, makeGame, play, stateMessage } from "@/src/features/online/testing/fixtures";

describe("isNewer", () => {
  it("accepts the first snapshot and only higher versions afterwards", () => {
    const game = makeGame(bettingState(), { version: 5 });
    expect(isNewer(null, game)).toBe(true);
    expect(isNewer(game, { ...game, version: 5 })).toBe(false);
    expect(isNewer(game, { ...game, version: 4 })).toBe(false);
    expect(isNewer(game, { ...game, version: 6 })).toBe(true);
  });

  it("accepts any version of a different game", () => {
    const game = makeGame(bettingState(), { version: 9 });
    expect(isNewer(game, { ...game, gameId: "other", version: 1 })).toBe(true);
  });
});

describe("planGameMessage", () => {
  const roundWon = stateMessage(makeGame(bettingState()), [
    { kind: "ROUND_WON", reason: "NATURAL", result: { winnerId: "player1", winningSum: 7, amount: 50_000 } },
  ]);

  it("animates rolls and tells each player whether the round is theirs", () => {
    const forShooter = planGameMessage(roundWon, "player1");
    expect(forShooter.animateRoll).toBe(true);
    expect(forShooter.roundWon).toEqual({
      winnerId: "player1",
      winningSum: 7,
      amount: 50_000,
      mine: true,
    });
    expect(forShooter.toast).toEqual({
      key: "game.toast.shooterWinsNatural",
      params: { name: "Ana", sum: 7, amount: 50_000 },
    });
    expect(planGameMessage(roundWon, "player2").roundWon?.mine).toBe(false);
  });

  it("congratulates the remaining player when the opponent leaves", () => {
    const over = play(bettingState(), { type: "FORFEIT", playerId: "player2" });
    const plan = planGameMessage(
      stateMessage(makeGame(over, { status: "GAME_OVER" }), [
        { kind: "GAME_OVER", winnerId: "player1", reason: "FORFEIT" },
      ], "playerLeft"),
      "player1",
    );
    expect(plan.gameOver).toEqual({ mine: true });
    expect(plan.toast).toEqual({ key: "game.toast.opponentLeft", params: { name: "Beto" } });
  });

  it("does not animate non-roll actions", () => {
    const plan = planGameMessage(stateMessage(makeGame(bettingState()), [{ kind: "BET_PLACED", amount: 50_000 }]), "player2");
    expect(plan.animateRoll).toBe(false);
  });
});

describe("shouldAutoKeepBet", () => {
  it("only for the local bettor whose bet already reached the cap", () => {
    const point = play(
      bettingState(),
      { type: "PLACE_BET", playerId: "player2", amount: 1_000_000 },
      { type: "ROLL", playerId: "player1", dice: [2, 2] },
    );
    const game = makeGame(point);
    expect(shouldAutoKeepBet(game, "player2")).toBe(true);
    expect(shouldAutoKeepBet(game, "player1")).toBe(false);
  });
});

describe("errorMessageKey", () => {
  it("hides expected races and maps the rest to translations", () => {
    expect(errorMessageKey("TOO_EARLY")).toBeNull();
    expect(errorMessageKey("GAME_FULL")).toBe("online.error.gameFull");
    expect(errorMessageKey("INTERNAL")).toBe("online.error.generic");
  });
});
