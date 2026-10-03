import React from "react";
import { Text, View } from "react-native";
import { styles } from "@/src/features/game/components/StatusBanner/StatusBanner.styles";
import type { StatusBannerProps } from "@/src/features/game/components/StatusBanner/StatusBanner.types";

/** Non-dismissable status line, styled like the game toast. */
export const StatusBanner: React.FC<StatusBannerProps> = ({ message }) => {
  if (!message) return null;
  return (
    <View
      style={styles.container}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
    >
      <View style={styles.pill}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};
