import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import type { TranslationKey } from "@/src/core/i18n/translations";
import { GameModes } from "@/src/features/game/types";
import type { RequestResult } from "@/src/features/online/engine/onlineClient";
import { getOnlineClient } from "@/src/features/online/engine/onlineClientInstance";
import { errorMessageKey } from "@/src/features/online/model/presentation";
import { getUsername, saveUsername } from "@/src/features/online/storage/onlineStorage";

const failureKey = (result: Extract<RequestResult, { ok: false }>): TranslationKey =>
  result.reason === "CONNECTION" || result.reason === "TIMEOUT"
    ? "online.error.connectionFailed"
    : (errorMessageKey(result.reason) ?? "online.error.generic");

/** Lobby state: the player's name, create/join requests and their errors. */
export const useOnlineLobby = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getUsername().then((name) => {
        if (active && name) setDisplayName(name);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const run = async (request: () => Promise<RequestResult>) => {
    setIsConnecting(true);
    setErrorKey(null);
    const result = await request();
    setIsConnecting(false);
    if (result.ok) {
      router.replace({ pathname: "/game", params: { mode: GameModes.ONLINE } });
    } else {
      setErrorKey(failureKey(result));
    }
  };

  const createGame = () => run(() => getOnlineClient().createGame(displayName));

  const joinGame = (code: string) => {
    const shortCode = code.trim().toUpperCase();
    if (shortCode) return run(() => getOnlineClient().joinGame(displayName, shortCode));
  };

  const changeName = async (name: string) => {
    await saveUsername(name);
    setDisplayName(name.trim());
  };

  return {
    displayName,
    isConnecting,
    error: errorKey ? t(errorKey) : null,
    createGame,
    joinGame,
    changeName,
  };
};
