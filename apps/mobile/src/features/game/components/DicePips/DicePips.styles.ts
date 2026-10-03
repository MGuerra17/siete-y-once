import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";

export const styles = StyleSheet.create({
  pipsContainer: {
    width: "70%",
    height: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pipColumn: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  pip: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.textPrimary,
  },
});
