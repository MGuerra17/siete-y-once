export type HomeScreenProps = {
  modeOnlineLabel: string;
  modeOfflineLabel: string;
  modeOfflineDescription: string;
  modeOnlineDescription: string;
  onOfflinePress: () => void;
  onOnlinePress: () => void;
  onOpenConfig: () => void;
  isNavigating: boolean;
};
