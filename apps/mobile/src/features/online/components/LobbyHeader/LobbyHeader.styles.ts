import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: spacing.lg,
  },
  backButtonPressed: {
    backgroundColor: colors.surface + "80",
  },
  usernameButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexShrink: 1,
    minWidth: 0,
  },
  usernameButtonPressed: {
    opacity: 0.9,
  },
  usernameButtonText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: "600",
  },
});
