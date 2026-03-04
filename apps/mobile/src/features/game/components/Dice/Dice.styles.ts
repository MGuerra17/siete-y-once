import { StyleSheet } from "react-native";
import { spacing } from "@/src/theme/spacing";
import { colors } from "@/src/theme/colors";

export const styles = StyleSheet.create({
  die: {
    width: 64,
    height: 64,
    borderRadius: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.sm,
  },
  dieDisabled: {
    opacity: 0.5,
  },
});

