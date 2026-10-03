import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import type { AvatarProps } from "@/src/core/components/Avatar/Avatar.types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/typography";

const RING_WIDTH = 3;
const RING_GAP = 3;

/** Initial in a colored circle, with an optional active / countdown ring around it. */
export const Avatar: React.FC<AvatarProps> = ({
  name,
  background,
  foreground,
  size = 44,
  isActive = false,
  ringColor = colors.sun,
  countdownProgress = null,
}) => {
  const outer = size + (RING_WIDTH + RING_GAP) * 2;
  const radius = outer / 2 - RING_WIDTH / 2;
  const circumference = 2 * Math.PI * radius;
  const showCountdown = countdownProgress !== null;
  const visible = showCountdown ? Math.max(0, 1 - countdownProgress) * circumference : circumference;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <View style={{ width: outer, height: outer }} importantForAccessibility="no-hide-descendants">
      {(isActive || showCountdown) && (
        <Svg width={outer} height={outer} style={StyleSheet.absoluteFill}>
          <Circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={RING_WIDTH}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${visible} ${circumference}`}
            transform={`rotate(-90 ${outer / 2} ${outer / 2})`}
          />
        </Svg>
      )}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: background,
            margin: RING_WIDTH + RING_GAP,
          },
        ]}
      >
        <Text style={[styles.initial, { color: foreground, fontSize: size * 0.43 }]}>{initial}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: { alignItems: "center", justifyContent: "center" },
  initial: { fontFamily: fonts.display },
});
