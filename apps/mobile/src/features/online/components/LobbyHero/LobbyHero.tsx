import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { useBreakpoints } from "@/src/core/hooks/useBreakpoints";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { styles } from "@/src/features/online/components/LobbyHero/LobbyHero.styles";

const heroImage = require("@/assets/images/online-main.png");

/** Illustration, title and subtitle at the top of the lobby. */
export const LobbyHero: React.FC = () => {
  const { t } = useLanguage();
  const { isTablet, isLargeTablet } = useBreakpoints();
  return (
    <>
      <View
        style={[
          styles.heroImageContainer,
          isTablet && styles.heroImageContainerTablet,
          isLargeTablet && styles.heroImageContainerLargeTablet,
        ]}
      >
        <Image source={heroImage} style={styles.heroImage} contentFit="contain" accessible={false} />
      </View>
      <Text style={styles.heroTitle} accessibilityRole="header">
        {t("online.lobby.heroTitle")}
      </Text>
      <Text style={styles.heroSubtitle}>{t("online.lobby.heroSubtitle")}</Text>
    </>
  );
};
