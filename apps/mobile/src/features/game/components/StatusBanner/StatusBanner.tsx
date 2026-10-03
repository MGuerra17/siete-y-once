import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { GlassSurface } from "@/src/core/components/GlassSurface/GlassSurface";
import type { StatusBannerProps } from "@/src/features/game/components/StatusBanner/StatusBanner.types";
import { colors } from "@/src/theme/colors";
import { radii } from "@/src/theme/spacing";
import { fonts } from "@/src/theme/typography";

/** Persistent connection status (reconnecting, rival away), floating below the top bar. */
export const StatusBanner: React.FC<StatusBannerProps> = ({ message }) => {
  if (!message) return null;
  return (
    <GlassSurface
      strong
      style={styles.banner}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
    >
      <Ionicons name="cloud-offline-outline" size={16} color={colors.sun} />
      <Text style={styles.text} numberOfLines={2}>
        {message}
      </Text>
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
  },
  text: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.textPrimary, flexShrink: 1 },
});
