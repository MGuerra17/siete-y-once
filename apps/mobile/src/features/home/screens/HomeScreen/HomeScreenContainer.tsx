import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useSound } from "@/src/core/hooks/useSound";
import { GameModes } from "@/src/features/game/types";
import { ConfigMenu } from "@/src/features/home/components/ConfigMenu/ConfigMenu";
import { HomeScreen } from "@/src/features/home/screens/HomeScreen/HomeScreen";
import { UsernameBottomSheet } from "@/src/features/online/components/UsernameBottomSheet/UsernameBottomSheet";
import { getOnlineClient } from "@/src/features/online/engine/onlineClientInstance";
import { getUsername, saveUsername } from "@/src/features/online/storage/onlineStorage";

let resumeAttempted = false;

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

  // Once per launch: take the player back to an online game the app was closed in.
  useEffect(() => {
    if (resumeAttempted) return;
    resumeAttempted = true;
    getOnlineClient()
      .resume()
      .then((resumed) => {
        if (resumed) router.push({ pathname: "/game", params: { mode: GameModes.ONLINE } });
      });
  }, [router]);

  const goToLobby = () => {
    setIsNavigating(true);
    router.push({ pathname: "/online/lobby" });
  };

  const handleOfflinePress = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push({ pathname: "/game", params: { mode: GameModes.OFFLINE } });
  };

  const handleOnlinePress = async () => {
    if (isNavigating) return;
    if (await getUsername()) goToLobby();
    else setUsernameSheetVisible(true);
  };

  const handleUsernameSubmit = async (name: string) => {
    await saveUsername(name);
    setUsernameSheetVisible(false);
    goToLobby();
  };

  return (
    <>
      <HomeScreen
        modeOnlineLabel={t("home.modeOnline")}
        modeOfflineLabel={t("home.modeOffline")}
        modeOfflineDescription={t("home.modeOfflineDescription")}
        modeOnlineDescription={t("home.modeOnlineDescription")}
        configLabel={t("home.configTitle")}
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
