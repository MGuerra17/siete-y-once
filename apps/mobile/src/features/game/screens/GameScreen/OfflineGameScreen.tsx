import React from "react";
import { GameScreen } from "@/src/features/game/screens/GameScreen/GameScreen";
import { useOfflineGameScreen } from "@/src/features/game/hooks/useOfflineGameScreen";

export const OfflineGameScreen: React.FC = () => {
  const { screenProps } = useOfflineGameScreen();
  return <GameScreen {...screenProps} />;
};

