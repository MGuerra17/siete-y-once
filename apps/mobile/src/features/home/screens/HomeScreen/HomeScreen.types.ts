import { GameMode } from "@/src/features/game/enums/GameMode";

export type HomeScreenProps = {
  startLabel: string;
  startDisabled?: boolean;
  modeOnlineLabel: string;
  modeOfflineLabel: string;
  modeOfflineDescription: string;
  modeOnlineDescription: string;
  comingSoonLabel: string;
  onStart: () => void;
  onOpenConfig: () => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
};
