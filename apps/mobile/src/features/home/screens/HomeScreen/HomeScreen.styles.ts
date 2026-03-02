import { StyleSheet } from "react-native";
import { spacing } from "@/src/theme/spacing";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: spacing.xl,
  },
  startButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    width: "80%",
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageToggle: {
    flexDirection: "row",
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  languageButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  languageButtonActive: {
    backgroundColor: colors.primary,
  },
  languageButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  languageButtonTextActive: {
    color: colors.textPrimary,
  },
});

