import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { GlassSurface } from "@/src/core/components/GlassSurface/GlassSurface";
import type { IconName } from "@/src/core/components/PrimaryButton/PrimaryButton.types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/typography";

type IconButtonProps = {
  accessibilityLabel: string;
  onPress: () => void;
  icon?: IconName;
  /** Short text instead of an icon (e.g. "ES"). */
  text?: string;
  strong?: boolean;
};

const SIZE = 40;

/** Round 40 pt glass button (44 pt touch target through hitSlop). */
export const IconButton: React.FC<IconButtonProps> = ({ accessibilityLabel, onPress, icon, text, strong }) => (
  <Pressable
    onPress={onPress}
    hitSlop={4}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    style={({ pressed }) => pressed && styles.pressed}
  >
    <GlassSurface strong={strong} style={[styles.surface, text ? styles.withText : styles.round]}>
      {icon && <Ionicons name={icon} size={18} color={colors.textPrimary} />}
      {text && <Text style={styles.text}>{text}</Text>}
    </GlassSurface>
  </Pressable>
);

const styles = StyleSheet.create({
  surface: {
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  round: { width: SIZE },
  withText: { minWidth: SIZE, paddingHorizontal: 14 },
  text: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.textPrimary },
  pressed: { opacity: 0.8 },
});
