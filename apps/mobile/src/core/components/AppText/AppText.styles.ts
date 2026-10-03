import { StyleSheet } from "react-native";
import type { AppTextTone } from "@/src/core/components/AppText/AppText.types";
import { colors } from "@/src/theme/colors";
import { typography } from "@/src/theme/typography";

export const variantStyles = StyleSheet.create(typography);

export const toneColors: Record<AppTextTone, string> = {
  light: colors.textPrimary,
  strong: colors.textStrong,
  soft: colors.textSecondary,
  muted: colors.textMuted,
  dark: colors.textOnSand,
  darkMuted: colors.textOnSandMuted,
  sun: colors.sun,
  coral: colors.coral,
};
