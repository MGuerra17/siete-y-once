import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { styles } from "@/src/core/components/AmbientBackground/AmbientBackground.styles";
import { RadialCircle } from "@/src/core/components/RadialCircle/RadialCircle";
import { colors } from "@/src/theme/colors";

const TABLET_MIN_WIDTH = 600;

const CIRCLES = [
  { size: 150, tabletSize: 280, style: styles.circle1, tabletStyle: styles.circle1Tablet },
  { size: 140, tabletSize: 260, style: styles.circle2, tabletStyle: styles.circle2Tablet },
  { size: 130, tabletSize: 240, style: styles.circle3, tabletStyle: styles.circle3Tablet },
  { size: 120, tabletSize: 220, style: styles.circle4, tabletStyle: styles.circle4Tablet },
] as const;

/** Blurred glow circles behind the home and lobby screens (skipped on Android for performance). */
export const AmbientBackground: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;

  if (Platform.OS === "android") return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.layer}>
        {CIRCLES.map(({ size, tabletSize, style, tabletStyle }) => (
          <RadialCircle
            key={size}
            size={isTablet ? tabletSize : size}
            color={colors.primary}
            opacity={isTablet ? 0.35 : 0.4}
            style={[styles.circle, style, isTablet && tabletStyle]}
          />
        ))}
      </View>
      <BlurView
        intensity={100}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        pointerEvents="none"
        style={styles.layer}
      />
    </View>
  );
};
