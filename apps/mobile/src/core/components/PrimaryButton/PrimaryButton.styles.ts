import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { shadows } from "@/src/theme/shadows";
import { radii } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";

export const styles = StyleSheet.create({
  base: {
    height: 60,
    borderRadius: radii.lg,
    backgroundColor: colors.coral,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
    overflow: "hidden",
    ...shadows.coral,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    ...typography.button,
    color: colors.textOnCoral,
  },
});
