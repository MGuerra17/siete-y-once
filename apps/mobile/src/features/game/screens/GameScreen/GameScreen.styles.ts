import { StyleSheet } from "react-native";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  top: {
    flex: 1,
    justifyContent: "flex-start",
  },
  middle: {
    flex: 1,
    justifyContent: "center",
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: spacing.lg,
  },
});

