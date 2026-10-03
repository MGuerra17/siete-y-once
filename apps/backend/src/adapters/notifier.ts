import {
  ApiGatewayManagementApiClient,
  GoneException,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import type { ServerMessage } from "@seven/protocol";
import type { Notifier } from "../game/ports";
import { logger } from "../lib/logger";

const clients = new Map<string, ApiGatewayManagementApiClient>();

/** One management client per API endpoint, cached for the lifetime of the container. */
function clientFor(endpoint: string): ApiGatewayManagementApiClient {
  let client = clients.get(endpoint);
  if (!client) {
    client = new ApiGatewayManagementApiClient({ endpoint });
    clients.set(endpoint, client);
  }
  return client;
}

export class ApiGatewayNotifier implements Notifier {
  private readonly client: ApiGatewayManagementApiClient;

  constructor(endpoint: string) {
    this.client = clientFor(endpoint);
  }

  async send(connectionId: string, message: ServerMessage): Promise<void> {
    try {
      await this.client.send(
        new PostToConnectionCommand({ ConnectionId: connectionId, Data: JSON.stringify(message) }),
      );
    } catch (error) {
      // A stale connection is not an error: $disconnect will (or already did) clean it up.
      if (error instanceof GoneException) return;
      logger.warn("postToConnection failed", { connectionId, error: String(error) });
    }
  }
}
