import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { DynamoConnectionsRepository, DynamoGamesRepository } from "../adapters/dynamo";
import { ApiGatewayNotifier } from "../adapters/notifier";
import { GameService } from "../game/service";
import { config } from "../lib/config";
import { cryptoIds, cryptoRandom } from "../lib/ids";

const games = new DynamoGamesRepository(config.gamesTable);
const connections = new DynamoConnectionsRepository(config.connectionsTable);

/** Wires the service with AWS adapters for the API endpoint that received the event. */
export function createService(event: APIGatewayProxyWebsocketEventV2): GameService {
  const { domainName, stage } = event.requestContext;
  return new GameService({
    games,
    connections,
    notifier: new ApiGatewayNotifier(`https://${domainName}/${stage}`),
    clock: { now: () => Date.now() },
    ids: cryptoIds,
    random: cryptoRandom,
  });
}

export const OK = { statusCode: 200 } as const;
