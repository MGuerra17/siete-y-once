import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  controlButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: spacing.xl,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  controlButtonSmall: {
    flex: 1,
  },
  controlButtonDisabled: {
    opacity: 0.4,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  controlButtonTextDisabled: {
    color: colors.textSecondary,
  },
});
