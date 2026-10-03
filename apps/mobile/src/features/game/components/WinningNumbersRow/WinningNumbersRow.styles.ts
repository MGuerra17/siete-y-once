import { StyleSheet } from "react-native";
import { spacing } from "@/src/theme/spacing";
import { colors } from "@/src/theme/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  containerRight: {
    justifyContent: "flex-end",
  },
  label: {
    marginLeft: spacing.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  list: {
    flexDirection: "row",
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
  },
  pillText: {
    color: colors.textPrimary,
  },
});

