import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { illustrations } from "@/src/core/assets/illustrations";
import { AppText } from "@/src/core/components/AppText/AppText";
import { GlassButton } from "@/src/core/components/GlassButton/GlassButton";
import { IconButton } from "@/src/core/components/IconButton/IconButton";
import { PosterScreen } from "@/src/core/components/PosterScreen/PosterScreen";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { MIN_TOUCH } from "@/src/theme/spacing";

export type HomeScreenProps = {
  onPlayOnline: () => void;
  onPlayLocal: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onToggleLanguage: () => void;
  isNavigating: boolean;
};

/** Poster home: illustration, title in the sky, two ways to play. */
export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlayOnline,
  onPlayLocal,
  onOpenRules,
  onOpenSettings,
  onToggleLanguage,
  isNavigating,
}) => {
  const { t } = useLanguage();

  return (
    <PosterScreen
      testID="home-screen"
      source={illustrations.home}
      fadeStart={0.6}
      eyebrow={t("home.eyebrow")}
      title={t("home.title")}
      topRight={
        <>
          <IconButton
            text={t("home.languageShort")}
            accessibilityLabel={t("home.a11y.language", { language: t("home.languageShort") })}
            onPress={onToggleLanguage}
          />
          <IconButton
            icon="options-outline"
            accessibilityLabel={t("home.configTitle")}
            onPress={onOpenSettings}
          />
        </>
      }
    >
      <AppText variant="body" tone="soft" align="center" style={styles.tagline}>
        {t("home.tagline")}
      </AppText>
      <PrimaryButton
        label={t("home.playOnline")}
        icon="globe-outline"
        onPress={onPlayOnline}
        disabled={isNavigating}
      />
      <GlassButton
        label={t("home.playLocal")}
        icon="phone-portrait-outline"
        onPress={onPlayLocal}
        disabled={isNavigating}
      />
      <Pressable onPress={onOpenRules} accessibilityRole="button" style={styles.link} hitSlop={6}>
        <AppText variant="bodyStrong" tone="sun">
          {t("home.howToPlay")}
        </AppText>
      </Pressable>
    </PosterScreen>
  );
};

const styles = StyleSheet.create({
  tagline: { marginBottom: 6 },
  link: { minHeight: MIN_TOUCH, alignItems: "center", justifyContent: "center" },
});
