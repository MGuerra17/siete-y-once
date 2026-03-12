/**
 * WebSocket URL for the online game backend (API Gateway WebSocket).
 * Set EXPO_PUBLIC_WS_URL in .env (e.g. wss://xxx.execute-api.region.amazonaws.com/prod).
 */
export const getWebSocketUrl = (): string => {
  const url = process.env.EXPO_PUBLIC_WS_URL;
  if (url && url.trim()) {
    return url.trim();
  }
  return "";
};
