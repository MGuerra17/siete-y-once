import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { GameState, Player } from "../../core/types/game";
import type { PlayerId } from "../../core/types/game";

const client = new DynamoDBClient({});
const GAMES_TABLE = process.env.GAMES_TABLE!;

/** DynamoDB item shape for a game (stored as-is; we use attribute names as in GameState). */
interface GameItem {
  gameId: string;
  shortCode: string;
  status: string;
  phase: string;
  player1: Record<string, unknown>;
  player2?: Record<string, unknown> | null;
  shooterId?: string | null;
  bettorId?: string | null;
  currentBet: number;
  minBet: number;
  keepBet: boolean;
  point?: number | null;
  diceValues: [number, number];
  totalRounds: number;
  initialRolls: Record<string, number>;
  activeInitialRollerId?: string | null;
  lastWinnerId?: string | null;
  lastWinningNumber?: number | null;
  createdAt: string;
  updatedAt: string;
}

function itemToPlayer(raw: Record<string, unknown>, id: PlayerId): Player {
  return {
    id,
    displayName: (raw.displayName as string) ?? "",
    connectionId: (raw.connectionId as string | null) ?? null,
    disconnectedAt: (raw.disconnectedAt as string | null | undefined) ?? null,
    rejoinToken: (raw.rejoinToken as string) ?? "",
    currentMoney: (raw.currentMoney as number) ?? 0,
    currentRole: (raw.currentRole as Player["currentRole"]) ?? "BETTER",
    winningNumbers: Array.isArray(raw.winningNumbers) ? (raw.winningNumbers as number[]) : [],
    isActive: (raw.isActive as boolean) ?? false,
  };
}

function playerToItem(p: Player): Record<string, unknown> {
  return {
    id: p.id,
    displayName: p.displayName,
    connectionId: p.connectionId,
    disconnectedAt: p.disconnectedAt ?? null,
    rejoinToken: p.rejoinToken,
    currentMoney: p.currentMoney,
    currentRole: p.currentRole,
    winningNumbers: p.winningNumbers,
    isActive: p.isActive,
  };
}

function itemToGameState(item: GameItem): GameState {
  const initialRolls: Partial<Record<PlayerId, number>> = {};
  if (item.initialRolls) {
    if (typeof item.initialRolls.player1 === "number") initialRolls.player1 = item.initialRolls.player1;
    if (typeof item.initialRolls.player2 === "number") initialRolls.player2 = item.initialRolls.player2;
  }
  return {
    gameId: item.gameId,
    shortCode: (item.shortCode as string) ?? "",
    status: item.status as GameState["status"],
    phase: item.phase,
    player1: itemToPlayer(item.player1 ?? {}, "player1"),
    player2: item.player2 ? itemToPlayer(item.player2 as Record<string, unknown>, "player2") : null,
    shooterId: (item.shooterId as PlayerId | null) ?? null,
    bettorId: (item.bettorId as PlayerId | null) ?? null,
    currentBet: item.currentBet ?? 0,
    minBet: item.minBet ?? 50_000,
    keepBet: item.keepBet ?? false,
    point: item.point ?? null,
    diceValues: Array.isArray(item.diceValues) && item.diceValues.length >= 2
      ? [Number(item.diceValues[0]), Number(item.diceValues[1])]
      : [1, 1],
    totalRounds: item.totalRounds ?? 0,
    initialRolls,
    activeInitialRollerId: (item.activeInitialRollerId as PlayerId | null) ?? null,
    lastWinnerId: (item.lastWinnerId as PlayerId | null) ?? null,
    lastWinningNumber: (item.lastWinningNumber as number | null) ?? null,
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? new Date().toISOString(),
  };
}

function gameStateToItem(state: GameState): GameItem {
  const initialRolls: Record<string, number> = {};
  if (state.initialRolls.player1 !== undefined) initialRolls.player1 = state.initialRolls.player1;
  if (state.initialRolls.player2 !== undefined) initialRolls.player2 = state.initialRolls.player2;

  return {
    gameId: state.gameId,
    shortCode: state.shortCode,
    status: state.status,
    phase: state.phase,
    player1: playerToItem(state.player1),
    player2: state.player2 ? playerToItem(state.player2) : null,
    shooterId: state.shooterId,
    bettorId: state.bettorId,
    currentBet: state.currentBet,
    minBet: state.minBet,
    keepBet: state.keepBet,
    point: state.point,
    diceValues: state.diceValues,
    totalRounds: state.totalRounds,
    initialRolls,
    activeInitialRollerId: state.activeInitialRollerId,
    lastWinnerId: state.lastWinnerId,
    lastWinningNumber: state.lastWinningNumber,
    createdAt: state.createdAt,
    updatedAt: state.updatedAt,
  };
}

export async function getGame(gameId: string): Promise<GameState | null> {
  const res = await client.send(
    new GetItemCommand({
      TableName: GAMES_TABLE,
      Key: marshall({ gameId }),
    })
  );
  if (!res.Item) return null;
  const item = unmarshall(res.Item) as GameItem;
  return itemToGameState(item);
}

/** Look up a game by its short code (for joining). Returns null if not found. */
export async function getGameByShortCode(shortCode: string): Promise<GameState | null> {
  const normalized = shortCode.toString().trim().toUpperCase();
  if (!normalized) return null;
  const res = await client.send(
    new QueryCommand({
      TableName: GAMES_TABLE,
      IndexName: "shortCode-index",
      KeyConditionExpression: "shortCode = :sc",
      ExpressionAttributeValues: marshall({ ":sc": normalized }),
      Limit: 1,
    })
  );
  if (!res.Items || res.Items.length === 0) return null;
  const item = unmarshall(res.Items[0]) as GameItem;
  return itemToGameState(item);
}

export async function putGame(state: GameState): Promise<void> {
  const item = gameStateToItem(state);
  await client.send(
    new PutItemCommand({
      TableName: GAMES_TABLE,
      Item: marshall(item, { removeUndefinedValues: true }),
    })
  );
}

/**
 * Set connectionId for a player slot to null (on disconnect) or to a new id (on rejoin).
 */
export async function updatePlayerConnection(
  gameId: string,
  playerSlot: PlayerId,
  connectionId: string | null
): Promise<void> {
  const name = playerSlot === "player1" ? "player1" : "player2";
  await client.send(
    new UpdateItemCommand({
      TableName: GAMES_TABLE,
      Key: marshall({ gameId }),
      UpdateExpression: `SET #player.#connectionId = :cid`,
      ExpressionAttributeNames: {
        "#player": name,
        "#connectionId": "connectionId",
      },
      ExpressionAttributeValues: marshall({ ":cid": connectionId }),
    })
  );
}
