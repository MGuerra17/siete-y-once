import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  comingSoonBadge: {
    position: "absolute",
    top: -spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  comingSoonText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.background,
  },
  modeCard: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.sm,
    borderRadius: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 120,
  },
  modeCardActive: {
    backgroundColor: colors.primary + "40",
    borderColor: colors.primary,
  },
  modeCardDisabled: {
    opacity: 0.7,
  },
  modeCardIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  modeCardIconWrapperActive: {
    backgroundColor: colors.primary,
  },
  modeCardIconWrapperDisabled: {
    backgroundColor: colors.border,
  },
  modeCardLargeTablet: {
    minHeight: 160,
  },
  modeCardTablet: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    minHeight: 140,
  },
  modeDescription: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: spacing.xs,
  },
  modeDescriptionActive: {
    color: colors.textSecondary,
  },
  modeDescriptionDisabled: {
    color: colors.textSecondary,
  },
  modeDescriptionTablet: {
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  modeLabel: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  modeLabelActive: {
    color: colors.textPrimary,
  },
  modeLabelDisabled: {
    color: colors.textSecondary,
  },
  modeLabelTablet: {
    fontSize: fontSize.lg,
  },
});
