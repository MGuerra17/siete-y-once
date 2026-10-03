import { useLocalSearchParams } from "expo-router";
import React from "react";
import { GameModes, type GameMode } from "@/src/features/game/types";
import { OfflineGameScreen } from "@/src/features/offline/screens/OfflineGameScreen";
import { OnlineGameScreen } from "@/src/features/online/screens/OnlineGameScreen/OnlineGameScreen";

export default function Game() {
  const { mode } = useLocalSearchParams<{ mode?: GameMode }>();
  return mode === GameModes.ONLINE ? <OnlineGameScreen /> : <OfflineGameScreen />;
}
