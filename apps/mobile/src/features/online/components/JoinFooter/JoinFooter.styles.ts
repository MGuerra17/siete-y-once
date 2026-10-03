import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  footerJoin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: "100%",
  },
  footerJoinTablet: {
    paddingHorizontal: spacing.xl,
  },
  footerJoinLargeTablet: {
    paddingHorizontal: spacing.xxl,
  },
  haveCodeText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  joinCtaButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  joinCtaButtonPressed: {
    backgroundColor: colors.primary + "25",
  },
  joinCtaButtonDisabled: {
    opacity: 0.6,
  },
  joinCtaLabel: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.primary,
  },
  joinCtaLabelDisabled: {
    color: colors.textSecondary,
  },
});
