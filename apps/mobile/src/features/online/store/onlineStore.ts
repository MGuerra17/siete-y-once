import { create } from "zustand";
import type { PlayerId } from "@/src/features/game/types";

export type OnlineStoreState = {
  gameId: string | null;
  shortCode: string | null;
  rejoinToken: string | null;
  myPlayerSlot: PlayerId | null;
  wsConnected: boolean;
  opponentConnected: boolean;
  displayName: string | null;
  isCreator: boolean;
};

type OnlineStoreActions = {
  setSession: (
    gameId: string,
    shortCode: string,
    rejoinToken: string,
    myPlayerSlot: PlayerId,
  ) => void;
  setWsConnected: (connected: boolean) => void;
  setOpponentConnected: (connected: boolean) => void;
  setDisplayName: (name: string) => void;
  setIsCreator: (value: boolean) => void;
  setShortCode: (code: string) => void;
  setRejoinToken: (token: string) => void;
  reset: () => void;
};

export type OnlineStore = OnlineStoreState & OnlineStoreActions;

const initialState: OnlineStoreState = {
  gameId: null,
  shortCode: null,
  rejoinToken: null,
  myPlayerSlot: null,
  wsConnected: false,
  opponentConnected: false,
  displayName: null,
  isCreator: false,
};

export const useOnlineStore = create<OnlineStore>((set) => ({
  ...initialState,

  setSession: (gameId, shortCode, rejoinToken, myPlayerSlot) =>
    set({ gameId, shortCode, rejoinToken, myPlayerSlot }),

  setWsConnected: (connected) => set({ wsConnected: connected }),

  setOpponentConnected: (connected) => set({ opponentConnected: connected }),

  setDisplayName: (name) => set({ displayName: name }),

  setIsCreator: (value) => set({ isCreator: value }),

  setShortCode: (code) => set({ shortCode: code }),

  setRejoinToken: (token) => set({ rejoinToken: token }),

  reset: () => set(initialState),
}));
