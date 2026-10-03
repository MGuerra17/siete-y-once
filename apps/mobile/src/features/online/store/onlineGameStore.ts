import type { PublicGame } from "@seven/protocol";
import { create } from "zustand";
import { emptyGameStats, type GameStats } from "@/src/features/game/model/gameStats";
import type { Flyer } from "@/src/features/game/types";
import type { SocketStatus } from "@/src/features/online/services/socketClient";
import type { OnlineSession } from "@/src/features/online/storage/onlineStorage";

export type OnlineGameState = {
  status: SocketStatus;
  session: OnlineSession | null;
  /** The snapshot currently on screen (lags behind the server while animations play). */
  game: PublicGame | null;
  /** serverTime - localTime, used to convert server deadlines to the local clock. */
  serverOffsetMs: number;
  isRolling: boolean;
  /** True while a result is being presented; holds back prompts and the bet sheet. */
  isPresenting: boolean;
  /** True between sending an action and the server's answer, to avoid double sends. */
  isAwaitingServer: boolean;
  toastMessage: string | null;
  flyer: Flyer | null;
  stats: GameStats;
};

export const createOnlineInitialState = (): OnlineGameState => ({
  status: "idle",
  session: null,
  game: null,
  serverOffsetMs: 0,
  isRolling: false,
  isPresenting: false,
  isAwaitingServer: false,
  toastMessage: null,
  flyer: null,
  stats: emptyGameStats(),
});

export const useOnlineGameStore = create<OnlineGameState>(createOnlineInitialState);
