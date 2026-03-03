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
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.35)",
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(17, 24, 39, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  lockButtonPermanent: {
    opacity: 0.85,
  },
});
