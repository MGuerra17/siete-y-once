import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";

export const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  activeBorder: {
    borderColor: colors.primary,
  },
  inactiveBorder: {
    borderColor: colors.border,
  },
  placeholder: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
});

