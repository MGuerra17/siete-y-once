import { getWebSocketUrl } from "@/src/core/config/env";
import { createEmitter } from "@/src/core/utils/emitter";
import type { GameEvent } from "@/src/features/game/types";
import { createOnlineClient, type OnlineClient } from "@/src/features/online/engine/onlineClient";
import { useOnlineGameStore } from "@/src/features/online/store/onlineGameStore";

/** Sound/haptic events of the online game, shared by every screen that plays it. */
export const onlineGameEvents = createEmitter<GameEvent>();

let client: OnlineClient | null = null;

/** The app-wide online client (one connection shared by the lobby and the game screen). */
export const getOnlineClient = (): OnlineClient => {
  client ??= createOnlineClient({
    url: getWebSocketUrl(),
    getState: useOnlineGameStore.getState,
    setState: useOnlineGameStore.setState,
    events: onlineGameEvents,
  });
  return client;
};
