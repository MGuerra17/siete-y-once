import React from "react";
import { useRouter } from "expo-router";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { HomeScreen } from "./HomeScreen";

export const HomeScreenContainer: React.FC = () => {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const handleStart = () => {
    router.push("/game");
  };

  return (
    <HomeScreen
      title={t("home.welcomeTitle")}
      startLabel={t("home.startGame")}
      language={language}
      englishLabel={t("home.languageEnglish")}
      spanishLabel={t("home.languageSpanish")}
      onStart={handleStart}
      onSelectLanguage={setLanguage}
    />
  );
};

