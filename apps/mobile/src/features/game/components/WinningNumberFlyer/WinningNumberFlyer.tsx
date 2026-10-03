import type { WinningNumberFlyerProps } from "@/src/features/game/components/WinningNumberFlyer/WinningNumberFlyer.types";
import type { PlayerId } from "@/src/features/game/types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/typography";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useReducedMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Point = { x: number; y: number };
type Curve = { start: Point; ctrl: Point; end: Point };

// Approximate screen-space positions based on the 3-section layout (top / middle / bottom, each flex:1)
// player2 (top section, row-reversed → winning numbers on the LEFT)
// player1 (bottom section, normal → winning numbers on the RIGHT)
const curveFor = (playerId: PlayerId, width: number, height: number): Curve =>
  ({
  player2: {
    start: { x: width * 0.18, y: height * 0.15 },
    // arc sweeps toward the right before coming down to center
    ctrl: { x: width * 0.85, y: height * 0.22 },
    end: { x: width * 0.5, y: height * 0.44 },
  },
  player1: {
    start: { x: width * 0.78, y: height * 0.85 },
    // arc sweeps toward the left before rising to center
    ctrl: { x: width * 0.15, y: height * 0.78 },
    end: { x: width * 0.5, y: height * 0.56 },
  },
  })[playerId];

const PILL_W = 44;
const PILL_H = 34;

/** Quadratic bezier interpolation — must run as a worklet */
function qBezier(p0: number, p1: number, p2: number, t: number): number {
  "worklet";
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

export const WinningNumberFlyer: React.FC<WinningNumberFlyerProps> = ({
  number,
  playerId,
}) => {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const progress = useSharedValue(0);
  const { width, height } = useWindowDimensions();
  const { start, ctrl, end } = curveFor(playerId, width, height);

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration: 950, easing: Easing.out(Easing.cubic) },
      (finished) => {
        "worklet";
        if (finished) {
          runOnJS(setVisible)(false);
        }
      },
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const t = progress.value;

    // Quadratic bezier position, offset so the pill is centered on the computed point
    const x = qBezier(start.x, ctrl.x, end.x, t) - PILL_W / 2;
    const y = qBezier(start.y, ctrl.y, end.y, t) - PILL_H / 2;

    // Scale grows 1 → 2 along the path
    const scale = 1 + t;

    // Fade out gently in the last 25% of the animation
    const opacity = t > 0.75 ? Math.max(0, 1 - (t - 0.75) / 0.25) : 1;

    return {
      transform: [{ translateX: x }, { translateY: y }, { scale }],
      opacity,
    };
  });

  if (!visible || reduceMotion) return null;

  return (
    <Animated.View style={[styles.pill, animatedStyle]}>
      <Text style={styles.text}>{number}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pill: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PILL_W,
    height: PILL_H,
    borderRadius: PILL_H / 2,
    backgroundColor: colors.sun,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.textOnSand,
    fontFamily: fonts.display,
    fontSize: 16,
  },
});
