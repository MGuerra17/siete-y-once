import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { parseClientMessage } from "../game/messages";
import { logger } from "../lib/logger";
import { createService, OK } from "./context";

export const handler = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { connectionId } = event.requestContext;
  const service = createService(event);
  try {
    await service.onMessage(connectionId, parseClientMessage(event.body));
  } catch (error) {
    logger.error("Unhandled error", { connectionId, error: String(error) });
    await service.reportInternalError(connectionId).catch(() => undefined);
  }
  return OK;
};
