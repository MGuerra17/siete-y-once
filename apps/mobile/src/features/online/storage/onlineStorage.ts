import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PlayerId } from "@seven/game-core";
import { DISPLAY_NAME_MAX_LENGTH } from "@seven/protocol";

const KEYS = {
  username: "@siete-y-once/username",
  session: "@siete-y-once/session",
  /** Pre-rebrand key, read once so existing players keep their name. */
  legacyUsername: "@seven-eleven/username",
} as const;

/** What a player needs to reclaim their seat after losing the connection or relaunching. */
export type OnlineSession = {
  gameId: string;
  shortCode: string;
  playerId: PlayerId;
  rejoinToken: string;
};

export const getUsername = async (): Promise<string | null> =>
  (await AsyncStorage.getItem(KEYS.username)) ?? AsyncStorage.getItem(KEYS.legacyUsername);

export const saveUsername = (name: string): Promise<void> =>
  AsyncStorage.setItem(KEYS.username, name.trim().slice(0, DISPLAY_NAME_MAX_LENGTH));

export const getSession = async (): Promise<OnlineSession | null> => {
  const raw = await AsyncStorage.getItem(KEYS.session);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnlineSession;
  } catch {
    return null;
  }
};

export const saveSession = (session: OnlineSession): Promise<void> =>
  AsyncStorage.setItem(KEYS.session, JSON.stringify(session));

export const clearSession = (): Promise<void> => AsyncStorage.removeItem(KEYS.session);
