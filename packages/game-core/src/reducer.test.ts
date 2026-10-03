import { describe, expect, it } from "vitest";
import { INITIAL_MONEY, MIN_BET } from "./constants";
import { createInitialState, getDefaultAction, reduce } from "./reducer";
import { getActivePlayerId, getMaxBet, getWinningNumbers } from "./selectors";
import { GamePhase, type Dice, type GameAction, type GameState } from "./types";

/** Applies actions in order and fails the test on the first rejected one. */
function play(state: GameState, ...actions: GameAction[]): GameState {
  return actions.reduce((current, action) => {
    const result = reduce(current, action);
    if (!result.ok) throw new Error(`${action.type} rejected: ${result.error}`);
    return result.state;
  }, state);
}

const d = (a: number, b: number): Dice => [a, b];

/** A game where player1 won the initial roll and is the shooter. */
const shooterIsPlayer1 = (): GameState =>
  play(
    createInitialState(),
    { type: "INITIAL_ROLL", playerId: "player1", dice: d(6, 6) },
    { type: "INITIAL_ROLL", playerId: "player2", dice: d(1, 1) },
  );

const withOpeningBet = (amount = MIN_BET) =>
  play(shooterIsPlayer1(), { type: "PLACE_BET", playerId: "player2", amount });

describe("initial roll", () => {
  it("starts with player1 and alternates to player2", () => {
    const state = createInitialState();
    expect(getActivePlayerId(state)).toBe("player1");
    const next = play(state, { type: "INITIAL_ROLL", playerId: "player1", dice: d(3, 4) });
    expect(getActivePlayerId(next)).toBe("player2");
  });

  it("makes the higher sum the shooter and moves to betting", () => {
    const state = shooterIsPlayer1();
    expect(state.shooterId).toBe("player1");
    expect(state.phase).toBe(GamePhase.BET_PLACEMENT);
    expect(getActivePlayerId(state)).toBe("player2");
  });

  it("restarts from player1 on a tie", () => {
    const result = reduce(
      play(createInitialState(), { type: "INITIAL_ROLL", playerId: "player1", dice: d(2, 3) }),
      { type: "INITIAL_ROLL", playerId: "player2", dice: d(4, 1) },
    );
    expect(result.ok && result.outcomes.map((o) => o.kind)).toContain("INITIAL_ROLL_TIE");
    expect(result.ok && result.state.initialRolls).toEqual({});
    expect(result.ok && getActivePlayerId(result.state)).toBe("player1");
  });

  it("rejects rolls out of turn and invalid dice", () => {
    const state = createInitialState();
    expect(reduce(state, { type: "INITIAL_ROLL", playerId: "player2", dice: d(1, 1) })).toEqual({
      ok: false,
      error: "NOT_YOUR_TURN",
    });
    expect(reduce(state, { type: "INITIAL_ROLL", playerId: "player1", dice: d(0, 7) })).toEqual({
      ok: false,
      error: "INVALID_DICE",
    });
  });
});

describe("betting", () => {
  it("caps the bet at the lower of both balances", () => {
    const state: GameState = { ...shooterIsPlayer1(), money: { player1: 300_000, player2: 1_700_000 } };
    expect(getMaxBet(state)).toBe(300_000);
    expect(reduce(state, { type: "PLACE_BET", playerId: "player2", amount: 350_000 })).toEqual({
      ok: false,
      error: "INVALID_BET",
    });
    expect(reduce(state, { type: "PLACE_BET", playerId: "player2", amount: 300_000 }).ok).toBe(true);
  });

  it("rejects bets below the minimum or off the step grid", () => {
    const state = shooterIsPlayer1();
    for (const amount of [0, 40_000, 75_000, Number.NaN]) {
      expect(reduce(state, { type: "PLACE_BET", playerId: "player2", amount }).ok).toBe(false);
    }
  });

  it("only lets the bettor bet", () => {
    expect(reduce(shooterIsPlayer1(), { type: "PLACE_BET", playerId: "player1", amount: MIN_BET })).toEqual({
      ok: false,
      error: "NOT_YOUR_TURN",
    });
  });
});

describe("come-out roll", () => {
  it.each([[d(3, 4)], [d(5, 6)]])("shooter wins on a natural %j", (dice) => {
    const result = reduce(withOpeningBet(100_000), { type: "ROLL", playerId: "player1", dice });
    if (!result.ok) throw new Error(result.error);
    expect(result.state.money).toEqual({
      player1: INITIAL_MONEY + 100_000,
      player2: INITIAL_MONEY - 100_000,
    });
    expect(result.state.shooterId).toBe("player1");
    expect(result.state.phase).toBe(GamePhase.BET_PLACEMENT);
    expect(result.state.round).toBe(1);
  });

  it.each([[d(1, 1)], [d(1, 2)], [d(6, 6)]])("bettor wins on craps %j and becomes shooter", (dice) => {
    const state = play(withOpeningBet(), { type: "ROLL", playerId: "player1", dice });
    expect(state.money.player2).toBe(INITIAL_MONEY + MIN_BET);
    expect(state.shooterId).toBe("player2");
  });

  it("sets the point on any other sum", () => {
    const state = play(withOpeningBet(), { type: "ROLL", playerId: "player1", dice: d(2, 2) });
    expect(state.point).toBe(4);
    expect(state.phase).toBe(GamePhase.POINT_PHASE);
    expect(getWinningNumbers(state, "player1")).toEqual([4]);
    expect(getWinningNumbers(state, "player2")).toEqual([7]);
  });
});

describe("point phase", () => {
  const withPoint = () => play(withOpeningBet(), { type: "ROLL", playerId: "player1", dice: d(4, 4) });

  it("lets the bettor raise but not lower the bet", () => {
    expect(reduce(withPoint(), { type: "PLACE_BET", playerId: "player2", amount: 0 }).ok).toBe(false);
    const raised = play(withPoint(), { type: "PLACE_BET", playerId: "player2", amount: 200_000 });
    expect(raised.currentBet).toBe(200_000);
    expect(raised.phase).toBe(GamePhase.WAITING_FOR_ROLL);
  });

  it("shooter wins by hitting the point", () => {
    const state = play(
      withPoint(),
      { type: "KEEP_BET", playerId: "player2" },
      { type: "ROLL", playerId: "player1", dice: d(5, 3) },
    );
    expect(state.lastRound).toEqual({ winnerId: "player1", winningSum: 8, amount: MIN_BET });
  });

  it("bettor wins on a seven-out", () => {
    const state = play(
      withPoint(),
      { type: "KEEP_BET", playerId: "player2" },
      { type: "ROLL", playerId: "player1", dice: d(6, 1) },
    );
    expect(state.lastRound?.winnerId).toBe("player2");
    expect(state.shooterId).toBe("player2");
  });

  it("returns to the bettor after a neutral roll unless the bet is locked", () => {
    const unlocked = play(
      withPoint(),
      { type: "KEEP_BET", playerId: "player2" },
      { type: "ROLL", playerId: "player1", dice: d(2, 3) },
    );
    expect(unlocked.phase).toBe(GamePhase.POINT_PHASE);

    const locked = play(
      withPoint(),
      { type: "KEEP_BET", playerId: "player2", lock: true },
      { type: "ROLL", playerId: "player1", dice: d(2, 3) },
    );
    expect(locked.phase).toBe(GamePhase.WAITING_FOR_ROLL);
  });

  it("resets the lock when the round ends", () => {
    const state = play(
      withPoint(),
      { type: "KEEP_BET", playerId: "player2", lock: true },
      { type: "ROLL", playerId: "player1", dice: d(4, 4) },
    );
    expect(state.betLocked).toBe(false);
  });
});

describe("game over", () => {
  it("ends when the loser can no longer cover the minimum bet", () => {
    const state: GameState = {
      ...shooterIsPlayer1(),
      money: { player1: 1_950_000, player2: MIN_BET },
    };
    const result = reduce(
      play(state, { type: "PLACE_BET", playerId: "player2", amount: MIN_BET }),
      { type: "ROLL", playerId: "player1", dice: d(5, 2) },
    );
    if (!result.ok) throw new Error(result.error);
    expect(result.state.phase).toBe(GamePhase.GAME_OVER);
    expect(result.state.winnerId).toBe("player1");
    expect(result.state.endReason).toBe("BANKRUPT");
    expect(reduce(result.state, { type: "FORFEIT", playerId: "player1" })).toEqual({
      ok: false,
      error: "GAME_OVER",
    });
  });

  it("awards the game to the opponent on forfeit", () => {
    const state = play(withOpeningBet(), { type: "FORFEIT", playerId: "player1" });
    expect(state.winnerId).toBe("player2");
    expect(state.endReason).toBe("FORFEIT");
  });

  it("conserves the total money in play", () => {
    let state = withOpeningBet(200_000);
    state = play(state, { type: "ROLL", playerId: "player1", dice: d(1, 1) });
    expect(state.money.player1 + state.money.player2).toBe(2 * INITIAL_MONEY);
  });
});

describe("getDefaultAction", () => {
  const dice = d(2, 5);

  it.each([
    ["initial roll", createInitialState(), { type: "INITIAL_ROLL", playerId: "player1", dice }],
    ["opening bet", shooterIsPlayer1(), { type: "PLACE_BET", playerId: "player2", amount: MIN_BET }],
    ["come-out roll", withOpeningBet(), { type: "ROLL", playerId: "player1", dice }],
  ] as const)("on %s", (_label, state, expected) => {
    expect(getDefaultAction(state, dice)).toEqual(expected);
  });

  it("keeps the bet during the point phase", () => {
    const state = play(withOpeningBet(), { type: "ROLL", playerId: "player1", dice: d(3, 3) });
    expect(getDefaultAction(state, dice)).toEqual({ type: "KEEP_BET", playerId: "player2" });
  });

  it("always produces an action the reducer accepts", () => {
    let state = createInitialState();
    let random = 0.137;
    for (let step = 0; step < 500 && state.phase !== GamePhase.GAME_OVER; step++) {
      random = (random * 9301 + 49297) % 233280 / 233280;
      const roll: Dice = [Math.floor(random * 6) + 1, ((step * 7) % 6) + 1];
      const action = getDefaultAction(state, roll)!;
      const result = reduce(state, action);
      expect(result.ok).toBe(true);
      if (result.ok) state = result.state;
    }
  });
});
