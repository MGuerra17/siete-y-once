import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  containerSecondary: {
    flexDirection: "row-reverse",
  },
  avatarColumn: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  info: {
    marginLeft: spacing.md,
    flex: 1,
    rowGap: spacing.xs,
  },
  infoSecondary: {
    marginLeft: 0,
    marginRight: spacing.xl,
  },
  moneyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    justifyContent: "space-between",
    width: "100%",
  },
  moneyChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.lg,
    backgroundColor: colors.primary + "20",
  },
  moneyIcon: {
    marginRight: spacing.xs,
  },
  moneyText: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    justifyContent: "space-between",
  },
  nameRowSecondary: {
    flexDirection: "row-reverse",
  },
  winningNumbersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: spacing.xs,
  },
  winningNumberPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  winningNumberPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  winningNumberText: {
    color: colors.textPrimary,
    fontWeight: "500",
  },
  roleChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.lg,
  },
  roleChipActive: {
    backgroundColor: colors.primary,
  },
  roleChipInactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleChipText: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
});

