import { ConditionalCheckFailedException, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  VersionConflictError,
  type ConnectionRecord,
  type ConnectionsRepository,
  type GamesRepository,
} from "../game/ports";
import type { ServerGame } from "../game/session";
import { SHORT_CODE_INDEX } from "../lib/tables";

/** Connections live at most 2 h in API Gateway; the TTL only cleans up missed $disconnects. */
const CONNECTION_TTL_SECONDS = 3 * 60 * 60;

// Created once per Lambda container and reused across invocations.
const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

export class DynamoGamesRepository implements GamesRepository {
  constructor(private readonly tableName: string) {}

  async get(gameId: string): Promise<ServerGame | null> {
    const { Item } = await documentClient.send(
      new GetCommand({ TableName: this.tableName, Key: { gameId }, ConsistentRead: true }),
    );
    return (Item as ServerGame | undefined) ?? null;
  }

  async findWaitingByShortCode(shortCode: string): Promise<ServerGame | null> {
    const { Items } = await documentClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: SHORT_CODE_INDEX,
        KeyConditionExpression: "shortCode = :code",
        FilterExpression: "#status = :waiting",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":code": shortCode, ":waiting": "WAITING_PLAYER" },
      }),
    );
    const match = Items?.[0] as Pick<ServerGame, "gameId"> | undefined;
    // The index is eventually consistent and only projects keys and status: re-read the item.
    return match ? this.get(match.gameId) : null;
  }

  async create(game: ServerGame): Promise<void> {
    await documentClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: game,
        ConditionExpression: "attribute_not_exists(gameId)",
      }),
    );
  }

  async update(game: ServerGame): Promise<void> {
    try {
      await documentClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: game,
          ConditionExpression: "version = :expected",
          ExpressionAttributeValues: { ":expected": game.version - 1 },
        }),
      );
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        throw new VersionConflictError(game.gameId);
      }
      throw error;
    }
  }
}

export class DynamoConnectionsRepository implements ConnectionsRepository {
  constructor(private readonly tableName: string) {}

  async get(connectionId: string): Promise<ConnectionRecord | null> {
    const { Item } = await documentClient.send(
      new GetCommand({ TableName: this.tableName, Key: { connectionId } }),
    );
    if (!Item) return null;
    return {
      connectionId,
      gameId: (Item.gameId as string | undefined) ?? null,
      playerId: (Item.playerId as ConnectionRecord["playerId"] | undefined) ?? null,
    };
  }

  async put(record: ConnectionRecord): Promise<void> {
    await documentClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          ...record,
          expiresAt: Math.floor(Date.now() / 1000) + CONNECTION_TTL_SECONDS,
        },
      }),
    );
  }

  async delete(connectionId: string): Promise<void> {
    await documentClient.send(new DeleteCommand({ TableName: this.tableName, Key: { connectionId } }));
  }
}
