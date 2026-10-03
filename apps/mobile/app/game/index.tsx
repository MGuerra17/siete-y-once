import React from "react";
import { useLocalSearchParams } from "expo-router";
import { GameMode } from "@/src/features/game/enums/GameMode";
import { OfflineGameScreen } from "@/src/features/offline/screens/OfflineGameScreen";
import { OnlineGameScreen } from "@/src/features/online/screens/OnlineGameScreen/OnlineGameScreen";

export default function Game() {
  const { mode } = useLocalSearchParams<{ mode?: GameMode }>();
  const isOnline = mode === GameMode.ONLINE;

  if (isOnline) {
    return <OnlineGameScreen />;
  }

  return <OfflineGameScreen />;
}
