import React, { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useSound } from "@/src/core/hooks/useSound";
import { HomeScreen } from "@/src/features/home/screens/HomeScreen/HomeScreen";
import { ConfigMenu } from "@/src/features/home/components/ConfigMenu/ConfigMenu";
import { GameMode } from "@/src/features/game/enums/GameMode";

export const HomeScreenContainer: React.FC = () => {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { soundEnabled, setSoundEnabled } = useSound();
  const [configVisible, setConfigVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.OFFLINE);
  const [isStarting, setIsStarting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsStarting(false);
    }, [setIsStarting]),
  );

  const handleStart = () => {
    if (isStarting) {
      return;
    }

    setIsStarting(true);

    if (selectedMode === GameMode.OFFLINE) {
      router.push({ pathname: "/game", params: { mode: selectedMode } });
    }
  };

  return (
    <>
      <HomeScreen
        startLabel={t("home.startGame")}
        startDisabled={isStarting}
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
