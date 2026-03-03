import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

const MIN_TOUCH_TARGET = 44;

export const styles = StyleSheet.create({
  top: {
    flex: 1,
    minHeight: 0,
    flexShrink: 1,
    justifyContent: "flex-start",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
  },
  exitButton: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
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
