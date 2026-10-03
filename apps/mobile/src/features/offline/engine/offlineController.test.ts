import { GamePhase, MIN_BET } from "@seven/game-core";
import { createEmitter } from "@/src/core/utils/emitter";
import type { GameEvent } from "@/src/features/game/types";
import { createOfflineController } from "@/src/features/offline/engine/offlineController";
import {
  createOfflineInitialState,
  type OfflineGameState,
} from "@/src/features/offline/store/offlineGameStore";

const ROLL_MS = 500;
const RESULT_MS = 2_000;

function setup() {
  let state = createOfflineInitialState();
  const randoms: number[] = [];
  const events = createEmitter<GameEvent>();
  const emitted: GameEvent[] = [];
  events.subscribe((event) => emitted.push(event));

  const controller = createOfflineController({
    getState: () => state,
    setState: (patch: Partial<OfflineGameState>) => {
      state = { ...state, ...patch };
    },
    events,
    nameOf: (id) => (id === "player1" ? "Ana" : "Beto"),
    translate: (message) => message.key,
    random: () => randoms.shift() ?? 0,
    timings: { rollMs: ROLL_MS, resultMs: RESULT_MS },
  });

  const queueDice = (a: number, b: number) => randoms.push((a - 1) / 6, (b - 1) / 6);
  /** Rolls and lets the roll animation and the result pause play out. */
  const roll = async (a: number, b: number) => {
    queueDice(a, b);
    controller.pressDice();
    await jest.advanceTimersByTimeAsync(ROLL_MS + RESULT_MS);
  };

  return { controller, roll, queueDice, emitted, get state() { return state; } };
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("offline controller", () => {
  it("plays the initial roll and asks the bettor to bet", async () => {
    const game = setup();
    game.controller.start();
    expect(game.state.toastMessage).toBe("game.toast.rollToDetermineShooter");

    await game.roll(6, 6);
    expect(game.state.core.initialRolls).toEqual({ player1: 12 });
    await game.roll(1, 2);

    expect(game.state.core.shooterId).toBe("player1");
    expect(game.state.core.phase).toBe(GamePhase.BET_PLACEMENT);
    expect(game.state.isBetSheetVisible).toBe(true);
    expect(game.state.toastMessage).toBe("game.toast.placeBet");
    expect(game.emitted.filter((e) => e.type === "roll")).toHaveLength(2);
  });

  it("resolves a round, pays out and shows the winning number", async () => {
    const game = setup();
    game.controller.start();
    await game.roll(6, 6);
    await game.roll(1, 2);
    game.controller.submitBet(200_000);
    expect(game.state.isBetSheetVisible).toBe(false);

    game.queueDice(5, 6);
    game.controller.pressDice();
    await jest.advanceTimersByTimeAsync(ROLL_MS);
    expect(game.state.core.money).toEqual({ player1: 1_200_000, player2: 800_000 });
    expect(game.state.flyer).toMatchObject({ playerId: "player1", number: 11 });
    expect(game.emitted).toContainEqual({ type: "roundWon", mine: true });
  });

  it("cancels pending steps when the game is left mid-roll", async () => {
    const game = setup();
    game.controller.start();
    game.queueDice(6, 6);
    game.controller.pressDice();
    game.controller.dispose();
    await jest.advanceTimersByTimeAsync(ROLL_MS + RESULT_MS);
    expect(game.state.core.initialRolls).toEqual({});
  });

  it("ignores taps while a roll is resolving", async () => {
    const game = setup();
    game.controller.start();
    game.queueDice(6, 6);
    game.controller.pressDice();
    game.controller.pressDice();
    await jest.advanceTimersByTimeAsync(ROLL_MS + RESULT_MS);
    expect(game.emitted.filter((e) => e.type === "roll")).toHaveLength(1);
  });

  it("bets the minimum when the bettor lets the timer expire", async () => {
    const game = setup();
    game.controller.start();
    await game.roll(6, 6);
    await game.roll(1, 2);
    game.controller.expireTurn();
    expect(game.state.core.currentBet).toBe(MIN_BET);
    expect(game.state.core.phase).toBe(GamePhase.SHOOTER_ROLLING);
  });

  it("keeps the bet automatically when it already covers the opponent's money", async () => {
    const game = setup();
    game.controller.start();
    await game.roll(6, 6);
    await game.roll(1, 2);
    game.controller.submitBet(1_000_000);
    await game.roll(2, 2); // point 4

    expect(game.state.core.phase).toBe(GamePhase.WAITING_FOR_ROLL);
    expect(game.state.core.betLocked).toBe(true);
    expect(game.state.isBetSheetVisible).toBe(false);
  });

  it("can start a fresh game after being disposed", async () => {
    const game = setup();
    game.controller.start();
    await game.roll(6, 6);
    game.controller.dispose();
    game.controller.start();
    expect(game.state.core.initialRolls).toEqual({});
    await game.roll(3, 3);
    expect(game.state.core.initialRolls).toEqual({ player1: 6 });
  });
});
