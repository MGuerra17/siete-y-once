import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
  },
  circle: {
    position: "absolute",
  },
  circle1: { top: "10%", left: "-10%", width: 120, height: 120 },
  circle2: { top: "25%", right: "-15%", width: 110, height: 110 },
  circle3: { bottom: "20%", left: "-5%", width: 100, height: 100 },
  circle4: { bottom: "35%", right: "-8%", width: 90, height: 90 },
  circle1Tablet: { left: "-4%", width: 190, height: 190 },
  circle2Tablet: { right: "-4%", width: 180, height: 180 },
  circle3Tablet: { left: "0%", width: 170, height: 170 },
  circle4Tablet: { right: "0%", width: 160, height: 160 },
});
