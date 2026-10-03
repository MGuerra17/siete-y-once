import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { fontSize } from "@/src/theme/fontSize";

export const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    backgroundColor: colors.primaryMuted,
    opacity: 0.7,
  },
  content: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  labelInvisible: {
    opacity: 0,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
});

