import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useSettingsStore } from "@/src/core/settings/settingsStore";
import { GameModes } from "@/src/features/game/types";
import { ConfigMenu } from "@/src/features/home/components/ConfigMenu/ConfigMenu";
import { RulesSheet } from "@/src/features/home/components/RulesSheet/RulesSheet";
import { HomeScreen } from "@/src/features/home/screens/HomeScreen/HomeScreen";
import { UsernameBottomSheet } from "@/src/features/online/components/UsernameBottomSheet/UsernameBottomSheet";
import { getOnlineClient } from "@/src/features/online/engine/onlineClientInstance";
import { getUsername, saveUsername } from "@/src/features/online/storage/onlineStorage";

let resumeAttempted = false;

type Sheet = "settings" | "rules" | "username" | null;

export const HomeScreenContainer: React.FC = () => {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const settings = useSettingsStore();
  const [sheet, setSheet] = useState<Sheet>(null);
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

  const handlePlayLocal = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push({ pathname: "/game", params: { mode: GameModes.OFFLINE } });
  };

  const handlePlayOnline = async () => {
    if (isNavigating) return;
    if (await getUsername()) goToLobby();
    else setSheet("username");
  };

  const handleUsernameSubmit = async (name: string) => {
    await saveUsername(name);
    setSheet(null);
    goToLobby();
  };

  const closeSheet = () => setSheet(null);

  return (
    <>
      <HomeScreen
        onPlayOnline={handlePlayOnline}
        onPlayLocal={handlePlayLocal}
        onOpenRules={() => setSheet("rules")}
        onOpenSettings={() => setSheet("settings")}
        onToggleLanguage={() => setLanguage(language === "es" ? "en" : "es")}
        isNavigating={isNavigating}
      />
      <ConfigMenu
        visible={sheet === "settings"}
        onClose={closeSheet}
        language={language}
        onSelectLanguage={setLanguage}
        soundEnabled={settings.soundEnabled}
        onSoundToggle={settings.setSoundEnabled}
        hapticsEnabled={settings.hapticsEnabled}
        onHapticsToggle={settings.setHapticsEnabled}
      />
      <RulesSheet visible={sheet === "rules"} onClose={closeSheet} />
      <UsernameBottomSheet
        visible={sheet === "username"}
        onClose={closeSheet}
        onSubmit={handleUsernameSubmit}
      />
    </>
  );
};
