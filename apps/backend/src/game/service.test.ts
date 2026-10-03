import { GamePhase, MIN_BET, RECONNECT_GRACE_MS, TURN_TIMEOUT_MS } from "@seven/game-core";
import type { ServerMessage } from "@seven/protocol";
import { beforeEach, describe, expect, it } from "vitest";
import { parseClientMessage } from "./messages";
import { GameService } from "./service";
import { TURN_PRESENTATION_BUFFER_MS } from "./session";
import { createFakeDependencies } from "./testing/fakes";

const HOST = "conn-host";
const GUEST = "conn-guest";

type Fake = ReturnType<typeof createFakeDependencies>;
let fake: Fake;
let service: GameService;

const send = (connectionId: string, message: object) =>
  service.onMessage(connectionId, parseClientMessage(JSON.stringify(message)));

const lastOf = <T extends ServerMessage["type"]>(connectionId: string, type: T) =>
  fake.deps.notifier
    .to(connectionId)
    .filter((m): m is Extract<ServerMessage, { type: T }> => m.type === type)
    .at(-1);

const storedGame = () => [...fake.deps.games.items.values()][0]!;

/** Host creates a game, guest joins it, host wins the initial roll (becomes shooter). */
async function startGame() {
  await service.onConnect(HOST);
  await service.onConnect(GUEST);
  await send(HOST, { action: "createGame", payload: { displayName: "Ana" } });
  const { shortCode } = lastOf(HOST, "session")!;
  await send(GUEST, { action: "joinGame", payload: { displayName: "Beto", shortCode } });
  fake.queueDice(6, 6);
  await send(HOST, { action: "initialRoll" });
  fake.queueDice(1, 1);
  await send(GUEST, { action: "initialRoll" });
}

beforeEach(() => {
  fake = createFakeDependencies();
  service = new GameService(fake.deps);
});

describe("lobby", () => {
  it("creates a game and gives the secret token only to its owner", async () => {
    await service.onConnect(HOST);
    await send(HOST, { action: "createGame", payload: { displayName: "  Ana  " } });

    const session = lastOf(HOST, "session")!;
    expect(session.playerId).toBe("player1");
    const state = lastOf(HOST, "gameState")!;
    expect(state.game.status).toBe("WAITING_PLAYER");
    expect(state.game.players.player1.displayName).toBe("Ana");
    expect(JSON.stringify(state)).not.toContain(session.rejoinToken);
  });

  it("joins by short code and never broadcasts rejoin tokens", async () => {
    await startGame();
    const guestToken = lastOf(GUEST, "session")!.rejoinToken;
    const hostToken = lastOf(HOST, "session")!.rejoinToken;
    for (const { message } of fake.deps.notifier.sent) {
      if (message.type === "gameState") {
        expect(JSON.stringify(message)).not.toContain(guestToken);
        expect(JSON.stringify(message)).not.toContain(hostToken);
      }
    }
    expect(lastOf(HOST, "gameState")!.game.state.shooterId).toBe("player1");
  });

  it("rejects an unknown code and a third player", async () => {
    await service.onConnect("other");
    await send("other", { action: "joinGame", payload: { displayName: "X", shortCode: "ZZZZZZ" } });
    expect(lastOf("other", "error")!.code).toBe("GAME_NOT_FOUND");

    await startGame();
    await send("other", {
      action: "joinGame",
      payload: { displayName: "X", shortCode: storedGame().shortCode },
    });
    expect(lastOf("other", "error")!.code).toBe("GAME_NOT_FOUND");
  });

  it("answers malformed messages with BAD_REQUEST", async () => {
    await service.onMessage(HOST, parseClientMessage("{not json"));
    await send(HOST, { action: "placeBet", payload: { amount: "lots" } });
    expect(fake.deps.notifier.to(HOST).map((m) => m.type === "error" && m.code)).toEqual([
      "BAD_REQUEST",
      "BAD_REQUEST",
    ]);
  });
});

describe("gameplay", () => {
  it("enforces turns and the bet cap", async () => {
    await startGame();
    await send(HOST, { action: "placeBet", payload: { amount: MIN_BET } });
    expect(lastOf(HOST, "error")!.code).toBe("NOT_YOUR_TURN");

    await send(GUEST, { action: "placeBet", payload: { amount: 1_050_000 } });
    expect(lastOf(GUEST, "error")!.code).toBe("INVALID_BET");

    await send(GUEST, { action: "placeBet", payload: { amount: 100_000 } });
    expect(storedGame().state.phase).toBe(GamePhase.SHOOTER_ROLLING);
  });

  it("resolves a round and broadcasts the outcome to both players", async () => {
    await startGame();
    await send(GUEST, { action: "placeBet", payload: { amount: 100_000 } });
    fake.queueDice(5, 6);
    await send(HOST, { action: "rollDice" });

    for (const connectionId of [HOST, GUEST]) {
      const message = lastOf(connectionId, "gameState")!;
      expect(message.outcomes).toContainEqual(expect.objectContaining({ kind: "ROUND_WON" }));
      expect(message.game.state.money).toEqual({ player1: 1_100_000, player2: 900_000 });
    }
  });

  it("retries once when a concurrent write wins the race", async () => {
    await startGame();
    fake.deps.games.conflictsToSimulate = 1;
    await send(GUEST, { action: "placeBet", payload: { amount: MIN_BET } });
    expect(storedGame().state.currentBet).toBe(MIN_BET);
  });
});

describe("turn timeout", () => {
  it("is rejected silently before the deadline and applied after it", async () => {
    await startGame();
    const versionBefore = storedGame().version;
    await send(HOST, { action: "turnTimeout" });
    expect(storedGame().version).toBe(versionBefore);
    expect(lastOf(HOST, "error")).toBeUndefined();

    fake.advance(TURN_TIMEOUT_MS + TURN_PRESENTATION_BUFFER_MS);
    await send(HOST, { action: "turnTimeout" });
    expect(storedGame().state.currentBet).toBe(MIN_BET);
    expect(lastOf(GUEST, "gameState")!.event).toBe("turnTimeout");
  });
});

describe("disconnection", () => {
  it("keeps the game alive during the grace period, then lets the opponent claim it", async () => {
    await startGame();
    await service.onDisconnect(GUEST);
    const notice = lastOf(HOST, "gameState")!;
    expect(notice.event).toBe("playerDisconnected");
    expect(notice.game.status).toBe("IN_PROGRESS");
    expect(notice.game.players.player2!.reconnectDeadline).not.toBeNull();

    await send(HOST, { action: "claimAbandonment" });
    expect(storedGame().status).toBe("IN_PROGRESS");

    fake.advance(RECONNECT_GRACE_MS);
    await send(HOST, { action: "claimAbandonment" });
    expect(storedGame().state.winnerId).toBe("player1");
    expect(storedGame().status).toBe("GAME_OVER");
  });

  it("lets a player rejoin with their token from a new connection", async () => {
    await startGame();
    const { gameId, rejoinToken } = lastOf(GUEST, "session")!;
    await service.onDisconnect(GUEST);
    await service.onConnect("conn-guest-2");
    await send("conn-guest-2", { action: "rejoinGame", payload: { gameId, rejoinToken } });

    expect(lastOf("conn-guest-2", "session")!.playerId).toBe("player2");
    expect(lastOf(HOST, "gameState")!.event).toBe("playerReconnected");
    expect(storedGame().players.player2!.connectionId).toBe("conn-guest-2");
  });

  it("refuses rejoining with somebody else's or a forged token", async () => {
    await startGame();
    const { gameId } = lastOf(GUEST, "session")!;
    await service.onConnect("intruder");
    await send("intruder", {
      action: "rejoinGame",
      payload: { gameId, rejoinToken: "forged-token-0123456789" },
    });
    expect(lastOf("intruder", "error")!.code).toBe("INVALID_REJOIN");
  });

  it("forfeits immediately when a player leaves on purpose", async () => {
    await startGame();
    await send(GUEST, { action: "leaveGame" });
    expect(storedGame().state.winnerId).toBe("player1");
    expect(lastOf(HOST, "gameState")!.event).toBe("playerLeft");
  });
});
