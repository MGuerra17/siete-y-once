import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
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
    gap: spacing.lg,
    backgroundColor: colors.surface,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  languageRow: {
    flexDirection: "row",
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  languageButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
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
  soundRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  soundLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: "500",
  },
});
