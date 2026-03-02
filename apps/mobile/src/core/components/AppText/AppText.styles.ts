import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";

export const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
  },
});

export const variantStyles = StyleSheet.create({
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  body: {
    fontSize: fontSize.md,
  },
  label: {
    fontSize: fontSize.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

