import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useCountdownProgress } from "@/src/features/game/hooks/useCountdownProgress";
import { useTurnTimerStore } from "@/src/features/game/store/turnTimerStore";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/typography";

const SIZE = 52;
const STROKE = 5;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Seconds left in the turn as a shrinking coral ring (leaf: only it re-renders per tick). */
export const CountdownRing: React.FC = () => {
  const progress = useCountdownProgress();
  const durationMs = useTurnTimerStore((s) => s.durationMs);
  if (progress === null) return null;
  const seconds = Math.ceil(((1 - progress) * durationMs) / 1000);

  return (
    <View style={styles.ring} accessible accessibilityRole="timer" accessibilityLabel={`${seconds}`}>
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="rgba(13,59,62,0.12)" strokeWidth={STROKE} fill="none" />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={colors.coral}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(1 - progress) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <Text style={styles.seconds}>{seconds}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ring: { width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center" },
  seconds: {
    position: "absolute",
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.textOnSand,
  },
});
