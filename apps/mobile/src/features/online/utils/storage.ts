import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PlayerId } from "@/src/features/game/types";

const KEYS = {
  USERNAME: "@seven-eleven/username",
  SESSION: "@seven-eleven/session",
} as const;

export type OnlineSession = {
  gameId: string;
  rejoinToken: string;
  myPlayerSlot: PlayerId;
};

export const getUsername = async (): Promise<string | null> => {
  return AsyncStorage.getItem(KEYS.USERNAME);
};

export const setUsername = async (name: string): Promise<void> => {
  await AsyncStorage.setItem(KEYS.USERNAME, name.trim().slice(0, 50));
};

export const getSession = async (): Promise<OnlineSession | null> => {
  const raw = await AsyncStorage.getItem(KEYS.SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnlineSession;
  } catch {
    return null;
  }
};

export const setSession = async (session: OnlineSession): Promise<void> => {
  await AsyncStorage.setItem(KEYS.SESSION, JSON.stringify(session));
};

export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEYS.SESSION);
};
