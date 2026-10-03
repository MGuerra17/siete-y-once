import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import {
  DynamoDBClient,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!;

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<{ statusCode: number }> => {
  const connectionId = event.requestContext.connectionId;
  const query = (event as { queryStringParameters?: Record<string, string> }).queryStringParameters ?? {};
  const displayName = (query.displayName ?? query.displayname ?? "Player").toString().trim().slice(0, 50) || "Player";

  const client = new DynamoDBClient({});
  await client.send(
    new PutItemCommand({
      TableName: CONNECTIONS_TABLE,
      Item: marshall({
        connectionId,
        displayName,
        createdAt: new Date().toISOString(),
      }),
    })
  );

  return { statusCode: 200 };
};
