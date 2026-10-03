import React from "react";
import { GameScreen } from "@/src/features/game/screens/GameScreen/GameScreen";
import { useOfflineGameScreen } from "@/src/features/offline/hooks/useOfflineGameScreen";

export const OfflineGameScreen: React.FC = () => <GameScreen {...useOfflineGameScreen()} />;
