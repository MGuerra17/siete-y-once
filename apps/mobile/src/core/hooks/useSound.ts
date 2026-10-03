import { useSettingsStore } from "@/src/core/settings/settingsStore";

/** Global sound preference and its setter. */
export const useSound = () => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  return { soundEnabled, setSoundEnabled };
};
