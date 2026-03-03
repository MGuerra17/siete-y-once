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
  pipsContainer: {
    width: "70%",
    height: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pipColumn: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  pip: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.textPrimary,
  },
  pipTransparent: {
    backgroundColor: "transparent",
  },
  dieDisabled: {
    opacity: 0.5,
  },
});

