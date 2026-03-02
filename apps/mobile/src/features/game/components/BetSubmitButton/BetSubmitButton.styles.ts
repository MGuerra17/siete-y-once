import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  submitButton: {
    marginTop: "auto",
    borderRadius: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  submitButtonDisabled: {
    backgroundColor: colors.primaryMuted,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.background,
  },
  submitButtonTextDisabled: {
    color: colors.textSecondary,
  },
});
