import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "80%",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.xl,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  code: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    letterSpacing: 8,
    color: colors.primary,
  },
  ghostButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  ghostIcon: {
    opacity: 0.8,
  },
  ghostLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  exitButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  actionLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  exitLabel: {
    color: colors.textSecondary,
  },
  primaryLabel: {
    color: colors.background,
  },
});
