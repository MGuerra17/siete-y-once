import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modal: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  background: {
    backgroundColor: colors.surface,
  },
  handleIndicator: {
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
    backgroundColor: colors.surface,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  playerBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  playerName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  amountContainer: {
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  amountSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  controlsContainer: {
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  primaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  primaryColumn: {
    flex: 1,
    gap: spacing.sm,
  },
  secondaryRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    columnGap: spacing.xs,
  },
});
