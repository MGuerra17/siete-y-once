import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  configCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  configCardTablet: {
    maxWidth: 420,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  configCardLargeTablet: {
    maxWidth: 480,
  },
  configCardLabel: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  configCardLabelSecond: {
    marginTop: spacing.md,
  },
  configValue: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
  },
  configValueNumber: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.primary,
  },
});
