export type HomeScreenProps = {
  modeOnlineLabel: string;
  modeOfflineLabel: string;
  modeOfflineDescription: string;
  modeOnlineDescription: string;
  /** Accessible label for the settings button. */
  configLabel: string;
  onOfflinePress: () => void;
  onOnlinePress: () => void;
  onOpenConfig: () => void;
  isNavigating: boolean;
};
