import type { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { createService, OK } from "./context";

export const handler = async (event: APIGatewayProxyWebsocketEventV2) => {
  await createService(event).onDisconnect(event.requestContext.connectionId);
  return OK;
};
