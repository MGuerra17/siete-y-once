import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";
import { GamePhase } from "../../core/enums/GamePhase";
import { PlayerRole } from "../../core/enums/PlayerRole";
import { INITIAL_MONEY, MIN_BET } from "../../core/constants/game.constants";
import type { GameState, Player, PlayerId } from "../../core/types/game";
import { rollDice } from "../../core/utils/dice";
import { generateShortCode } from "../../core/utils/code";
import { applyInitialRoll } from "../../core/game-logic/initial-roll";
import { placeBet, keepBet, shooterRoll } from "../../core/game-logic/bet-and-roll";
import { getGame, getGameByShortCode, putGame } from "../shared/game-state";
import { broadcastToGame, sendToConnection } from "../shared/broadcast";
import {
  getPlayerSlotByConnectionId,
  requirePlayerInGame,
  canPlaceBet,
  canRoll,
  canDoInitialRoll,
  canKeepBet,
  canRejoin,
  canClaimAbandonment,
} from "../shared/validation";

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!;

interface ConnectionRecord {
  connectionId: string;
  gameId?: string;
  playerSlot?: string;
  displayName?: string;
  createdAt?: string;
}

function getEndpoint(event: APIGatewayProxyWebsocketEventV2): string {
  const d = event.requestContext.domainName;
  const s = event.requestContext.stage;
  return `https://${d}/${s}`;
}

async function getConnection(connectionId: string): Promise<ConnectionRecord | null> {
  const client = new DynamoDBClient({});
  const res = await client.send(
    new GetItemCommand({
      TableName: CONNECTIONS_TABLE,
      Key: marshall({ connectionId }),
    })
  );
  if (!res.Item) return null;
  return unmarshall(res.Item) as ConnectionRecord;
}

async function updateConnection(
  connectionId: string,
  updates: Partial<Pick<ConnectionRecord, "gameId" | "playerSlot" | "displayName">>
): Promise<void> {
  const existing = await getConnection(connectionId);
  const merged: ConnectionRecord = {
    connectionId,
    displayName: existing?.displayName ?? "Player",
    ...existing,
    ...updates,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  const client = new DynamoDBClient({});
  await client.send(
    new PutItemCommand({
      TableName: CONNECTIONS_TABLE,
      Item: marshall(merged),
    })
  );
}

function createPlayer(
  id: PlayerId,
  connectionId: string,
  displayName: string,
  rejoinToken: string,
  role: PlayerRole,
  isActive: boolean
): Player {
  return {
    id,
    displayName,
    connectionId,
    rejoinToken,
    currentMoney: INITIAL_MONEY,
    currentRole: role,
    winningNumbers: id === "player1" ? [7, 11] : [2, 3, 12],
    isActive,
  };
}

async function handleSetDisplayName(
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const name = (payload.displayName as string)?.toString?.()?.trim?.()?.slice(0, 50) || "Player";
  const conn = await getConnection(connectionId);
  if (!conn) return;
  if (conn.gameId) return;
  await updateConnection(connectionId, { displayName: name });
  await sendToConnection(getEndpoint(event), connectionId, {
    type: "gameState",
    event: "displayNameSet",
    message: "OK",
  });
}

async function handleCreateGame(
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string,
  _payload: Record<string, unknown>
): Promise<void> {
  const conn = await getConnection(connectionId);
  if (!conn) return;
  if (conn.gameId) {
    await sendToConnection(getEndpoint(event), connectionId, {
      type: "error",
      message: "Already in a game",
    });
    return;
  }

  const gameId = randomUUID();
  const rejoinToken = randomUUID();
  const now = new Date().toISOString();

  let shortCode = generateShortCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await getGameByShortCode(shortCode);
    if (!existing) break;
    shortCode = generateShortCode();
  }

  const player1 = createPlayer(
    "player1",
    connectionId,
    conn.displayName ?? "Player 1",
    rejoinToken,
    PlayerRole.BETTER,
    true
  );

  const state: GameState = {
    gameId,
    shortCode,
    status: "WAITING_PLAYER",
    phase: GamePhase.INITIAL_ROLL,
    player1,
    player2: null,
    shooterId: null,
    bettorId: null,
    currentBet: 0,
    minBet: MIN_BET,
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
  };

  await putGame(state);
  await updateConnection(connectionId, { gameId, playerSlot: "player1" });

  await sendToConnection(getEndpoint(event), connectionId, {
    type: "gameState",
    game: state,
    event: "gameCreated",
    gameId,
    shortCode,
    rejoinToken,
  });
}

async function handleJoinGame(
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const gameIdRaw = (payload.gameId as string)?.toString?.();
  const codeRaw = (payload.shortCode ?? payload.code) as string | undefined;
  const code = codeRaw?.toString?.()?.trim();

  let state: GameState | null = null;
  if (code) {
    state = await getGameByShortCode(code);
  } else if (gameIdRaw) {
    state = await getGame(gameIdRaw);
  }

  if (!state) {
    await sendToConnection(getEndpoint(event), connectionId, {
      type: "error",
      message: code ? "Invalid or expired code" : "Missing gameId or code",
    });
    return;
  }

  const conn = await getConnection(connectionId);
  if (!conn) return;
  if (conn.gameId) {
    await sendToConnection(getEndpoint(event), connectionId, {
      type: "error",
      message: "Already in a game",
    });
    return;
  }

  if (state.status !== "WAITING_PLAYER" || state.player2) {
    await sendToConnection(getEndpoint(event), connectionId, {
      type: "error",
      message: "Game not found or already full",
    });
    return;
  }

  const rejoinToken = randomUUID();
  const now = new Date().toISOString();
  const player2 = createPlayer(
    "player2",
    connectionId,
    conn.displayName ?? "Player 2",
    rejoinToken,
    PlayerRole.ROLLER,
    false
  );

  const newState: GameState = {
    ...state,
    status: "IN_PROGRESS",
    player2,
    activeInitialRollerId: "player1",
    player1: { ...state.player1, isActive: true },
    updatedAt: now,
  };

  await putGame(newState);
  await updateConnection(connectionId, { gameId: state.gameId, playerSlot: "player2" });

  if (newState.player1.connectionId) {
    await sendToConnection(getEndpoint(event), newState.player1.connectionId, {
      type: "gameState",
      game: newState,
      event: "playerJoined",
    });
  }
  await sendToConnection(getEndpoint(event), connectionId, {
    type: "gameState",
    game: newState,
    event: "joined",
    shortCode: state.shortCode,
    rejoinToken,
  });
}

async function handleRejoinGame(
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const gameId = (payload.gameId as string)?.toString?.();
  const rejoinToken = (payload.rejoinToken as string)?.toString?.();
  if (!gameId || !rejoinToken) {
    await sendToConnection(getEndpoint(event), connectionId, {
      type: "error",
      message: "Missing gameId or rejoinToken",
    });
    return;
  }

  const state = await getGame(gameId);
  if (!state) {
    await sendToConnection(getEndpoint(event), connectionId, {
      type: "error",
      message: "Game not found",
    });
    return;
  }

  const slot = canRejoin(state, rejoinToken);
  if (!slot) {
    await sendToConnection(getEndpoint(event), connectionId, {
      type: "error",
      message: "Invalid rejoin token or game over",
    });
    return;
  }

  const conn = await getConnection(connectionId);
  const displayName = conn?.displayName ?? (slot === "player1" ? state.player1.displayName : state.player2!.displayName);

  const updatedPlayer = slot === "player1"
    ? { ...state.player1, connectionId, disconnectedAt: null }
    : { ...state.player2!, connectionId, disconnectedAt: null };
  const newState: GameState = {
    ...state,
    [slot]: updatedPlayer,
    updatedAt: new Date().toISOString(),
  };

  await putGame(newState);

  const client = new DynamoDBClient({});
  await client.send(
    new PutItemCommand({
      TableName: CONNECTIONS_TABLE,
      Item: marshall({
        connectionId,
        gameId,
        playerSlot: slot,
        displayName,
        createdAt: new Date().toISOString(),
      }),
    })
  );

  await sendToConnection(getEndpoint(event), connectionId, {
    type: "gameState",
    game: newState,
    event: "rejoined",
  });
  await broadcastToGame(getEndpoint(event), gameId, {
    type: "gameState",
    game: newState,
    event: "playerReconnected",
  });
}

async function handleInitialRoll(
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string
): Promise<void> {
  const conn = await getConnection(connectionId);
  if (!conn?.gameId) return;
  const state = await getGame(conn.gameId);
  if (!state || !state.player2) return;
  if (requirePlayerInGame(state, connectionId) === null) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "You are not a player in this game" });
    return;
  }
  if (!canDoInitialRoll(state, connectionId)) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "Not your turn" });
    return;
  }

  const [d1, d2] = rollDice();
  const sum = d1 + d2;
  const newState = applyInitialRoll(state, sum);
  newState.diceValues = [d1, d2];
  await putGame(newState);
  await broadcastToGame(getEndpoint(event), conn.gameId, {
    type: "gameState",
    game: newState,
    event: "initialRoll",
  });
}

async function handlePlaceBet(
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const amount = Number(payload.amount);
  if (!Number.isFinite(amount)) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "Invalid amount" });
    return;
  }
  const conn = await getConnection(connectionId);
  if (!conn?.gameId) return;
  const state = await getGame(conn.gameId);
  if (!state || !state.player2) return;
  if (requirePlayerInGame(state, connectionId) === null) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "You are not a player in this game" });
    return;
  }
  if (!canPlaceBet(state, amount)) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "Cannot place bet" });
    return;
  }
  const slot = getPlayerSlotByConnectionId(state, connectionId);
  if (slot !== state.bettorId) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "Not bettor" });
    return;
  }

  const newState = placeBet(state, amount);
  await putGame(newState);
  await broadcastToGame(getEndpoint(event), conn.gameId, {
    type: "gameState",
    game: newState,
    event: "betPlaced",
  });
}

async function handleKeepBet(
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string
): Promise<void> {
  const conn = await getConnection(connectionId);
  if (!conn?.gameId) return;
  const state = await getGame(conn.gameId);
  if (!state || !state.player2) return;
  if (requirePlayerInGame(state, connectionId) === null) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "You are not a player in this game" });
    return;
  }
  if (!canKeepBet(state, connectionId)) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "Cannot keep bet" });
    return;
  }

  const newState = keepBet(state);
  await putGame(newState);
  await broadcastToGame(getEndpoint(event), conn.gameId, {
    type: "gameState",
    game: newState,
    event: "keepBet",
  });
}

async function handleRollDice(
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string
): Promise<void> {
  const conn = await getConnection(connectionId);
  if (!conn?.gameId) return;
  const state = await getGame(conn.gameId);
  if (!state || !state.player2) return;
  if (requirePlayerInGame(state, connectionId) === null) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "You are not a player in this game" });
    return;
  }
  if (!canRoll(state, connectionId)) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "Cannot roll" });
    return;
  }

  const [d1, d2] = rollDice();
  const result = shooterRoll(state, [d1, d2]);
  await putGame(result.state);
  await broadcastToGame(getEndpoint(event), conn.gameId, {
    type: "gameState",
    game: result.state,
    event: result.roundEnd ? "roundEnd" : "roll",
    roundEnd: result.roundEnd,
  });
}

async function handleClaimAbandonment(
  event: APIGatewayProxyWebsocketEventV2,
  connectionId: string
): Promise<void> {
  const conn = await getConnection(connectionId);
  if (!conn?.gameId) return;
  const state = await getGame(conn.gameId);
  if (!state || !state.player2) return;
  if (requirePlayerInGame(state, connectionId) === null) {
    await sendToConnection(getEndpoint(event), connectionId, { type: "error", message: "You are not a player in this game" });
    return;
  }
  if (!canClaimAbandonment(state, connectionId)) {
    await sendToConnection(getEndpoint(event), connectionId, {
      type: "error",
      message: "Cannot claim abandonment yet (opponent may still rejoin within the timeout)",
    });
    return;
  }

  const winnerSlot = getPlayerSlotByConnectionId(state, connectionId)!;
  const newState: GameState = {
    ...state,
    status: "GAME_OVER",
    phase: GamePhase.GAME_OVER,
    lastWinnerId: winnerSlot,
    lastWinningNumber: null,
    updatedAt: new Date().toISOString(),
  };
  await putGame(newState);
  await broadcastToGame(getEndpoint(event), conn.gameId, {
    type: "gameState",
    game: newState,
    event: "gameOverByAbandonment",
    winnerId: winnerSlot,
  });
}

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<{ statusCode: number }> => {
  const connectionId = event.requestContext.connectionId;
  let body: { action?: string; payload?: Record<string, unknown> };
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    await sendToConnection(getEndpoint(event), connectionId, {
      type: "error",
      message: "Invalid JSON body",
    });
    return { statusCode: 200 };
  }

  const action = (body.action ?? "").toString();
  const payload = (body.payload ?? {}) as Record<string, unknown>;

  try {
    switch (action) {
      case "setDisplayName":
        await handleSetDisplayName(event, connectionId, payload);
        break;
      case "createGame":
        await handleCreateGame(event, connectionId, payload);
        break;
      case "joinGame":
        await handleJoinGame(event, connectionId, payload);
        break;
      case "rejoinGame":
        await handleRejoinGame(event, connectionId, payload);
        break;
      case "initialRoll":
        await handleInitialRoll(event, connectionId);
        break;
      case "placeBet":
        await handlePlaceBet(event, connectionId, payload);
        break;
      case "keepBet":
        await handleKeepBet(event, connectionId);
        break;
      case "rollDice":
        await handleRollDice(event, connectionId);
        break;
      case "claimAbandonment":
        await handleClaimAbandonment(event, connectionId);
        break;
      default:
        await sendToConnection(getEndpoint(event), connectionId, {
          type: "error",
          message: `Unknown action: ${action}`,
        });
    }
  } catch (err) {
    console.error("Default handler error:", err);
    await sendToConnection(getEndpoint(event), connectionId, {
      type: "error",
      message: "Internal error",
    });
  }

  return { statusCode: 200 };
};
