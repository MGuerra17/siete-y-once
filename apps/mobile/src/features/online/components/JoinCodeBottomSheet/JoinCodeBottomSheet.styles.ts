import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  modal: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  background: {
    backgroundColor: colors.background,
  },
  handleIndicator: {
    backgroundColor: colors.border,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    letterSpacing: 8,
  },
  pasteButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pasteButtonPressed: {
    opacity: 0.7,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    color: colors.danger,
    textAlign: "center",
  },
});
