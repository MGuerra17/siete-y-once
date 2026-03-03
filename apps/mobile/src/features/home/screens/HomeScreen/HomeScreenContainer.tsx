import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useSound } from "@/src/core/hooks/useSound";
import { HomeScreen } from "./HomeScreen";
import { ConfigMenu } from "../../components/ConfigMenu/ConfigMenu";
import type { GameMode } from "./HomeScreen.types";

export const HomeScreenContainer: React.FC = () => {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { soundEnabled, setSoundEnabled } = useSound();
  const [configVisible, setConfigVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode>("offline");

  const handleStart = () => {
    if (selectedMode === "offline") {
      router.push("/game");
    }
  };

  return (
    <>
      <HomeScreen
        startLabel={t("home.startGame")}
        modeOnlineLabel={t("home.modeOnline")}
        modeOfflineLabel={t("home.modeOffline")}
        modeOfflineDescription={t("home.modeOfflineDescription")}
        modeOnlineDescription={t("home.modeOnlineDescription")}
        comingSoonLabel={t("home.comingSoon")}
        onStart={handleStart}
        onOpenConfig={() => setConfigVisible(true)}
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
      />
      <ConfigMenu
        visible={configVisible}
        onClose={() => setConfigVisible(false)}
        language={language}
        onSelectLanguage={setLanguage}
        soundEnabled={soundEnabled}
        onSoundToggle={setSoundEnabled}
      />
    </>
  );
};
