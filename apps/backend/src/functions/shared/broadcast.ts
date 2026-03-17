import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import {
  DynamoDBClient,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!;

/**
 * Get all connection IDs for a game (GSI on Connections by gameId).
 */
export async function getConnectionIdsForGame(gameId: string): Promise<string[]> {
  const client = new DynamoDBClient({});
  const res = await client.send(
    new QueryCommand({
      TableName: CONNECTIONS_TABLE,
      IndexName: "gameId-index",
      KeyConditionExpression: "gameId = :gid",
      ExpressionAttributeValues: marshall({ ":gid": gameId }),
    })
  );
  if (!res.Items || res.Items.length === 0) return [];
  return res.Items.map((item) => (unmarshall(item).connectionId as string)).filter(Boolean);
}

/**
 * Send a message to a single connection. Caller must provide the endpoint URL (from requestContext).
 */
export async function sendToConnection(
  endpoint: string,
  connectionId: string,
  message: unknown
): Promise<void> {
  const url = new URL(endpoint);
  const client = new ApiGatewayManagementApiClient({
    endpoint: `https://${url.hostname}${url.pathname}`,
  });
  const body = typeof message === "string" ? message : JSON.stringify(message);
  await client.send(
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: Buffer.from(body, "utf-8"),
    })
  );
}

/**
 * Broadcast a message to all connections in a game. Endpoint from requestContext (domainName + stage).
 */
export async function broadcastToGame(
  endpoint: string,
  gameId: string,
  message: unknown
): Promise<void> {
  const connectionIds = await getConnectionIdsForGame(gameId);
  const body = typeof message === "string" ? message : JSON.stringify(message);
  const url = new URL(endpoint);
  const client = new ApiGatewayManagementApiClient({
    endpoint: `https://${url.hostname}${url.pathname}`,
  });

  await Promise.allSettled(
    connectionIds.map((connectionId) =>
      client.send(
        new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: Buffer.from(body, "utf-8"),
        })
      )
    )
  );
}
