import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import {
  DynamoDBClient,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { broadcastToGame } from "../shared/broadcast";
import { getGame, putGame } from "../shared/game-state";
import { GamePhase } from "../../core/enums/GamePhase";
import type { GameState } from "../../core/types/game";

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE!;
const GAMES_TABLE = process.env.GAMES_TABLE!;

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<{ statusCode: number }> => {
  const connectionId = event.requestContext.connectionId;
  const domainName = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const endpoint = `https://${domainName}/${stage}`;

  const client = new DynamoDBClient({});

  const connRes = await client.send(
    new GetItemCommand({
      TableName: CONNECTIONS_TABLE,
      Key: marshall({ connectionId }),
    })
  );

  if (connRes.Item) {
    const conn = unmarshall(connRes.Item) as { gameId?: string; playerSlot?: string };
    if (conn.gameId && conn.playerSlot) {
      const now = new Date().toISOString();
      await client.send(
        new UpdateItemCommand({
          TableName: GAMES_TABLE,
          Key: marshall({ gameId: conn.gameId }),
          UpdateExpression: "SET #player.#connectionId = :null, #player.#disconnectedAt = :now",
          ExpressionAttributeNames: {
            "#player": conn.playerSlot,
            "#connectionId": "connectionId",
            "#disconnectedAt": "disconnectedAt",
          },
          ExpressionAttributeValues: marshall({ ":null": null, ":now": now }),
        })
      );
      const game = await getGame(conn.gameId);
      if (game) {
        const disconnectedSlot = conn.playerSlot === "player2" ? "player2" : "player1";
        const updatedGame: GameState =
          disconnectedSlot === "player1"
            ? {
                ...game,
                player1: {
                  ...game.player1,
                  connectionId: null,
                  disconnectedAt: now,
                },
                updatedAt: now,
              }
            : {
                ...game,
                player2: game.player2
                  ? {
                      ...game.player2,
                      connectionId: null,
                      disconnectedAt: now,
                    }
                  : null,
                updatedAt: now,
              };

        // Requirement: if a user leaves an in-progress match, the match ends immediately
        // and the remaining player wins.
        if (updatedGame.status === "IN_PROGRESS" && updatedGame.player2) {
          const winnerId = disconnectedSlot === "player1" ? "player2" : "player1";
          const gameOverState: GameState = {
            ...updatedGame,
            status: "GAME_OVER",
            phase: GamePhase.GAME_OVER,
            lastWinnerId: winnerId,
            lastWinningNumber: null,
            updatedAt: now,
          };
          await putGame(gameOverState);
          await broadcastToGame(endpoint, conn.gameId, {
            type: "gameState",
            game: gameOverState,
            event: "gameOverByAbandonment",
            winnerId,
          });
        } else {
          await putGame(updatedGame);
          await broadcastToGame(endpoint, conn.gameId, {
            type: "gameState",
            game: updatedGame,
            event: "playerDisconnected",
          });
        }
      }
    }
  }

  await client.send(
    new DeleteItemCommand({
      TableName: CONNECTIONS_TABLE,
      Key: marshall({ connectionId }),
    })
  );

  return { statusCode: 200 };
};
