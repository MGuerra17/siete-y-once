import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";

export const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  countdownRing: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
  /** Transparent border when countdown ring is drawn on top so ring is the only visible border. */
  countdownBorder: {
    borderColor: "transparent",
  },
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

