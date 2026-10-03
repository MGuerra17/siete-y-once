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
  inputWrapper: {
    position: "relative",
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingRight: spacing.xl * 2,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  charCounter: {
    position: "absolute",
    right: spacing.md,
    top: "50%",
    transform: [{ translateY: -fontSize.xs / 2 }],
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
});
