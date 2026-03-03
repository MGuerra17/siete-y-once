export type GameMode = "online" | "offline";

export type HomeScreenProps = {
  startLabel: string;
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
