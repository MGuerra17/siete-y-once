import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  top: {
    flex: 1,
    justifyContent: "flex-start",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  exitButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.2)",
  },
  middle: {
    flex: 1,
    justifyContent: "center",
  },
  middleSlot: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: spacing.lg,
  },
  betBillContainer: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
});
