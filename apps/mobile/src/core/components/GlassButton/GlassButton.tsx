import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { GlassSurface } from "@/src/core/components/GlassSurface/GlassSurface";
import type { IconName } from "@/src/core/components/PrimaryButton/PrimaryButton.types";
import { colors } from "@/src/theme/colors";
import { radii } from "@/src/theme/spacing";
import { fonts } from "@/src/theme/typography";

type GlassButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Secondary action: translucent glass with a light label. */
export const GlassButton: React.FC<GlassButtonProps> = ({ label, onPress, icon, disabled, style }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled: !!disabled }}
    style={({ pressed }) => [pressed && styles.pressed, disabled && styles.disabled, style]}
  >
    <GlassSurface style={styles.surface}>
      {icon && <Ionicons name={icon} size={18} color={colors.textPrimary} />}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </GlassSurface>
  </Pressable>
);

const styles = StyleSheet.create({
  surface: {
    height: 56,
    borderRadius: radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 18,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
