import { GamePhase, type GameOutcome } from "@seven/game-core";
import type { PublicGame } from "@seven/protocol";
import { createEmitter } from "@/src/core/utils/emitter";
import type { GameEvent } from "@/src/features/game/types";
import { createOnlineClient } from "@/src/features/online/engine/onlineClient";
import type { OnlineSession } from "@/src/features/online/storage/onlineStorage";
import { createOnlineInitialState, type OnlineGameState } from "@/src/features/online/store/onlineGameStore";
import { FakeSocket, createFakeSocket } from "@/src/features/online/testing/fakeSocket";
import { bettingState, makeGame, play, stateMessage } from "@/src/features/online/testing/fixtures";

const SESSION: OnlineSession = {
  gameId: "00000000-0000-4000-8000-000000000001",
  shortCode: "ABC234",
  playerId: "player2",
  rejoinToken: "secret-token-1234567890",
};

function setup(storedSession: OnlineSession | null = null) {
  let state = createOnlineInitialState();
  let stored = storedSession;
  const emitted: GameEvent[] = [];
  const events = createEmitter<GameEvent>();
  events.subscribe((event) => emitted.push(event));

  const client = createOnlineClient({
    url: "wss://test",
    createSocket: createFakeSocket,
    getState: () => state,
    setState: (patch: Partial<OnlineGameState>) => {
      state = { ...state, ...patch };
    },
    events,
    translate: (message) => message.key,
    now: () => Date.now(),
    storage: {
      getSession: async () => stored,
      saveSession: async (session) => {
        stored = session;
      },
      clearSession: async () => {
        stored = null;
      },
    },
    timings: { rollMs: 500, resultMs: 2_000, requestTimeoutMs: 5_000, timeoutRetryMs: 1_000 },
  });

  return {
    client,
    emitted,
    get state() {
      return state;
    },
    get stored() {
      return stored;
    },
  };
}

/** Joins as player2 ("Beto", the bettor) into a game where Ana shoots. */
async function joinedGame() {
  const env = setup();
  const joining = env.client.joinGame("Beto", "ABC234");
  await Promise.resolve();
  const socket = FakeSocket.latest();
  socket.open();
  await jest.advanceTimersByTimeAsync(0);
  expect(socket.sent).toEqual([{ action: "joinGame", payload: { displayName: "Beto", shortCode: "ABC234" } }]);
  socket.receive({ type: "session", ...SESSION, serverTime: 0 });
  socket.receive(stateMessage(makeGame(bettingState(), { version: 2 }), [], "playerJoined"));
  await expect(joining).resolves.toEqual({ ok: true });
  await jest.advanceTimersByTimeAsync(0);
  return Object.assign(env, { socket });
}

beforeEach(() => {
  jest.useFakeTimers();
  FakeSocket.instances = [];
});
afterEach(() => jest.useRealTimers());

describe("online client", () => {
  it("joins a game, stores the private session and shows the board", async () => {
    const env = await joinedGame();
    expect(env.stored).toEqual(SESSION);
    expect(env.state.session?.playerId).toBe("player2");
    expect(env.state.game?.version).toBe(2);
  });

  it("reports lobby errors without navigating", async () => {
    const env = setup();
    const joining = env.client.joinGame("Beto", "ZZZZZZ");
    await Promise.resolve();
    FakeSocket.latest().open();
    await jest.advanceTimersByTimeAsync(0);
    FakeSocket.latest().receive({ type: "error", code: "GAME_NOT_FOUND", message: "x" });
    await expect(joining).resolves.toEqual({ ok: false, reason: "GAME_NOT_FOUND" });
  });

  it("ignores snapshots older than the one on screen", async () => {
    const env = await joinedGame();
    env.socket.receive(stateMessage(makeGame(bettingState(), { version: 1, status: "GAME_OVER" })));
    await jest.advanceTimersByTimeAsync(0);
    expect(env.state.game?.version).toBe(2);
  });

  it("plays the roll animation before revealing the opponent's roll", async () => {
    const env = await joinedGame();
    env.client.submitBet(100_000);
    expect(env.socket.sent.at(-1)).toEqual({ action: "placeBet", payload: { amount: 100_000 } });

    const afterBet = play(bettingState(), { type: "PLACE_BET", playerId: "player2", amount: 100_000 });
    env.socket.receive(stateMessage(makeGame(afterBet, { version: 3 }), [{ kind: "BET_PLACED", amount: 100_000 }]));
    await jest.advanceTimersByTimeAsync(0);

    const afterRoll = play(afterBet, { type: "ROLL", playerId: "player1", dice: [1, 1] });
    const outcomes: GameOutcome[] = [
      { kind: "ROUND_WON", reason: "CRAPS", result: { winnerId: "player2", winningSum: 2, amount: 100_000 } },
    ];
    env.socket.receive(stateMessage(makeGame(afterRoll, { version: 4 }), outcomes));
    await jest.advanceTimersByTimeAsync(0);
    expect(env.state.isRolling).toBe(true);
    expect(env.state.game?.version).toBe(3);

    await jest.advanceTimersByTimeAsync(500);
    expect(env.state.isRolling).toBe(false);
    expect(env.state.game?.version).toBe(4);
    expect(env.state.flyer).toMatchObject({ playerId: "player1", number: 2 });
    expect(env.emitted).toContainEqual({ type: "roundWon", mine: true });
  });

  it("unblocks the dice when the server rejects a roll", async () => {
    const env = await joinedGame();
    const game: PublicGame = makeGame(
      play(bettingState(), { type: "PLACE_BET", playerId: "player2", amount: 50_000 }),
      { version: 3 },
    );
    // Make the local player the shooter for this test.
    env.socket.receive(stateMessage({ ...game, state: { ...game.state, shooterId: "player2" } }));
    await jest.advanceTimersByTimeAsync(0);
    env.client.pressDice();
    expect(env.state.isRolling).toBe(true);
    expect(env.state.isAwaitingServer).toBe(true);

    env.socket.receive({ type: "error", code: "NOT_YOUR_TURN", message: "x" });
    expect(env.state.isRolling).toBe(false);
    expect(env.state.isAwaitingServer).toBe(false);
    expect(env.state.toastMessage).toBe("online.error.notYourTurn");
  });

  it("rejoins automatically after the connection drops", async () => {
    const env = await joinedGame();
    env.socket.drop();
    expect(env.state.status).toBe("reconnecting");
    await jest.advanceTimersByTimeAsync(1_000);
    FakeSocket.latest().open();
    expect(FakeSocket.latest().sent).toEqual([
      { action: "rejoinGame", payload: { gameId: SESSION.gameId, rejoinToken: SESSION.rejoinToken } },
    ]);
  });

  it("asks the server to apply a timeout and retries once if nothing changed", async () => {
    const env = await joinedGame();
    env.client.expireTurn();
    await jest.advanceTimersByTimeAsync(1_000);
    expect(env.socket.actions().filter((a) => a === "turnTimeout")).toHaveLength(2);
    await jest.advanceTimersByTimeAsync(5_000);
    expect(env.socket.actions().filter((a) => a === "turnTimeout")).toHaveLength(2);
  });

  it("forfeits, forgets the session and closes when leaving", async () => {
    const env = await joinedGame();
    env.client.leave();
    expect(env.socket.actions()).toContain("leaveGame");
    await jest.advanceTimersByTimeAsync(0);
    expect(env.stored).toBeNull();
    expect(env.state.game).toBeNull();
  });

  it("resumes a stored session after a relaunch", async () => {
    const env = setup(SESSION);
    const resuming = env.client.resume();
    await jest.advanceTimersByTimeAsync(0);
    const socket = FakeSocket.latest();
    socket.open();
    await jest.advanceTimersByTimeAsync(0);
    expect(socket.sent).toEqual([
      { action: "rejoinGame", payload: { gameId: SESSION.gameId, rejoinToken: SESSION.rejoinToken } },
    ]);
    socket.receive({ type: "session", ...SESSION, serverTime: 0 });
    socket.receive(stateMessage(makeGame(bettingState(), { version: 7 }), [], "playerReconnected"));
    await expect(resuming).resolves.toBe(true);
    expect(env.state.game?.state.phase).toBe(GamePhase.BET_PLACEMENT);
  });

  it("forgets a session the server no longer accepts", async () => {
    const env = setup(SESSION);
    const resuming = env.client.resume();
    await jest.advanceTimersByTimeAsync(0);
    FakeSocket.latest().open();
    await jest.advanceTimersByTimeAsync(0);
    FakeSocket.latest().receive({ type: "error", code: "INVALID_REJOIN", message: "x" });
    await expect(resuming).resolves.toBe(false);
    expect(env.stored).toBeNull();
  });
});
