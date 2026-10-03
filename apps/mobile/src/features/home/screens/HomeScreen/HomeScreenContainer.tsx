import React, { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useSound } from "@/src/core/hooks/useSound";
import { HomeScreen } from "@/src/features/home/screens/HomeScreen/HomeScreen";
import { ConfigMenu } from "@/src/features/home/components/ConfigMenu/ConfigMenu";
import { UsernameBottomSheet } from "@/src/features/online/components/UsernameBottomSheet/UsernameBottomSheet";
import {
  getUsername,
  setUsername as persistUsername,
} from "@/src/features/online/utils/storage";
import { useGameStore } from "@/src/features/game/store/gameStore";

export const HomeScreenContainer: React.FC = () => {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { soundEnabled, setSoundEnabled } = useSound();
  const [configVisible, setConfigVisible] = useState(false);
  const [usernameSheetVisible, setUsernameSheetVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsNavigating(false);
    }, []),
  );

  const handleOfflinePress = () => {
    if (isNavigating) return;
    // Siempre que iniciamos una partida offline, resetear el estado global del juego.
    useGameStore.getState().resetGame();
    setIsNavigating(true);
    router.push({ pathname: "/game", params: { mode: "offline" } });
  };

  const handleOnlinePress = async () => {
    if (isNavigating) return;
    const savedName = await getUsername();
    if (savedName) {
      setIsNavigating(true);
      router.push({ pathname: "/online/lobby" });
    } else {
      setUsernameSheetVisible(true);
    }
  };

  const handleUsernameSubmit = async (name: string) => {
    await persistUsername(name);
    setUsernameSheetVisible(false);
    setIsNavigating(true);
    router.push({ pathname: "/online/lobby" });
  };

  return (
    <>
      <HomeScreen
        modeOnlineLabel={t("home.modeOnline")}
        modeOfflineLabel={t("home.modeOffline")}
        modeOfflineDescription={t("home.modeOfflineDescription")}
        modeOnlineDescription={t("home.modeOnlineDescription")}
        onOfflinePress={handleOfflinePress}
        onOnlinePress={handleOnlinePress}
        onOpenConfig={() => setConfigVisible(true)}
        isNavigating={isNavigating}
      />
      <ConfigMenu
        visible={configVisible}
        onClose={() => setConfigVisible(false)}
        language={language}
        onSelectLanguage={setLanguage}
        soundEnabled={soundEnabled}
        onSoundToggle={setSoundEnabled}
      />
      <UsernameBottomSheet
        visible={usernameSheetVisible}
        onClose={() => setUsernameSheetVisible(false)}
        onSubmit={handleUsernameSubmit}
      />
    </>
  );
};
