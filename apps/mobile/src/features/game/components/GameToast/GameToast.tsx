import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { GameToastProps } from "@/src/features/game/components/GameToast/GameToast.types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/typography";

const DEFAULT_DURATION = 3000;

/** The latest game message, shown under the dice and cleared after `duration`. */
export const GameToast: React.FC<GameToastProps> = ({ message, duration = DEFAULT_DURATION, onDismiss }) => {
  const hasMessage = !!message && message.trim() !== "";

  useEffect(() => {
    if (!hasMessage) return;
    const timeout = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(timeout);
  }, [hasMessage, message, duration, onDismiss]);

  if (!hasMessage) return null;

  return (
    <View style={styles.container} accessibilityLabel={message} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Text style={styles.text} numberOfLines={2}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, alignItems: "center" },
  text: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    textAlign: "center",
    color: colors.ivoryWarm,
    textShadowColor: "rgba(0, 0, 0, 0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
});
