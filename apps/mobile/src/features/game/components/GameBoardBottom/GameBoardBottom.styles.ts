import { StyleSheet } from "react-native";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    minHeight: 0,
    flexShrink: 1,
    justifyContent: "flex-end",
    paddingBottom: spacing.lg,
  },
  betBillContainer: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
});

