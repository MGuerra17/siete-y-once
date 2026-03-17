import { StyleSheet } from "react-native";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  middle: {
    flex: 1,
    minHeight: 0,
    flexShrink: 1,
    justifyContent: "center",
  },
  middleSlot: {
    minHeight: 80,
    maxHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
  },
});

