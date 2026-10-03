import * as Haptics from "expo-haptics";
import { useSettingsStore } from "@/src/core/settings/settingsStore";

const enabled = () => useSettingsStore.getState().hapticsEnabled;

/** Fire-and-forget: haptics are a nicety, never an error path. */
const run = (effect: () => Promise<void>) => {
  if (enabled()) effect().catch(() => undefined);
};

export const haptics = {
  /** Light tap for primary game actions (roll, bet). */
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  selection: () => run(() => Haptics.selectionAsync()),
};
