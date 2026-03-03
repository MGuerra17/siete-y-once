import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  containerRight: {
    alignSelf: "flex-end",
  },
  containerCentered: {
    alignSelf: "center",
  },
  bill: {
    minWidth: 100,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary + "20",
    borderWidth: 1,
    borderColor: colors.primary + "50",
    borderRadius: 8,
    position: "relative",
    alignItems: "center",
  },
  billHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  lockButton: {
    position: "absolute",
    top: -spacing.lg,
    right: -spacing.md,
    minWidth: 44,
    minHeight: 44,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary + "50",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  lockButtonPermanent: {
    opacity: 0.85,
  },
});
