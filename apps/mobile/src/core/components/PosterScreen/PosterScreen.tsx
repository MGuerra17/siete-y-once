import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@/src/core/components/AppText/AppText";
import { styles } from "@/src/core/components/PosterScreen/PosterScreen.styles";
import type { PosterScreenProps } from "@/src/core/components/PosterScreen/PosterScreen.types";
import { posterLayout } from "@/src/core/components/PosterScreen/posterLayout";
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";

const TOP_SCRIM = ["rgba(13,59,62,0.4)", "rgba(13,59,62,0)"] as const;
const BOTTOM_FADE = ["rgba(13,59,62,0)", "rgba(13,59,62,0.8)", colors.background] as const;
const BOTTOM_FADE_STOPS = [0, 0.4, 0.75] as const;

/**
 * The "afiche" layout shared by every screen: an edge-to-edge illustration from the
 * top of the screen that fades into the background, a title in the sky and content
 * anchored to the bottom. Works from small phones to tablets (content is capped and centered).
 */
export const PosterScreen: React.FC<PosterScreenProps> = ({
  source,
  imageOffset = 0,
  fadeStart = 0.6,
  eyebrow,
  title,
  subtitle,
  titleSize = "hero",
  topLeft,
  topRight,
  children,
  testID,
}) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const layout = posterLayout({ width, height, imageOffset, fadeStart });

  return (
    <View style={styles.root} testID={testID}>
      <Image
        source={source}
        style={[styles.image, { top: imageOffset, width, height: layout.imageHeight }]}
        contentFit="cover"
        priority="high"
        transition={200}
        accessible={false}
      />
      <LinearGradient
        colors={TOP_SCRIM}
        style={[styles.topScrim, { height: insets.top + 140 }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={BOTTOM_FADE}
        locations={BOTTOM_FADE_STOPS}
        style={[styles.bottomFade, { top: layout.fadeTop, height: layout.fadeHeight }]}
        pointerEvents="none"
      />

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={styles.topBar}>
          <View style={styles.topSide}>{topLeft}</View>
          <View style={styles.topSide}>{topRight}</View>
        </View>

        {(eyebrow || title || subtitle) && (
          <View style={styles.sky}>
            {eyebrow && (
              <AppText variant="eyebrow" tone="strong" align="center">
                {eyebrow}
              </AppText>
            )}
            {title && (
              <AppText
                variant={titleSize}
                tone="strong"
                style={styles.title}
                accessibilityRole="header"
                adjustsFontSizeToFit
                numberOfLines={2}
              >
                {title}
              </AppText>
            )}
            {subtitle && (
              <AppText variant="body" tone="soft" align="center">
                {subtitle}
              </AppText>
            )}
          </View>
        )}

        <View style={styles.bottom}>{children}</View>
      </View>
    </View>
  );
};
