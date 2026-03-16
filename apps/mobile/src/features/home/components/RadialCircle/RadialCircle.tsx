import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import { colors } from "@/src/theme/colors";

type RadialCircleProps = {
  size: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
};

export const RadialCircle: React.FC<RadialCircleProps> = ({
  size,
  color = colors.primary,
  style,
  opacity = 1,
}) => {
  const radius = size / 2;
  const gradientId = "radialCircleGradient";

  return (
    <View style={[{ position: "absolute", width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient
            id={gradientId}
            cx="50%"
            cy="50%"
            rx="60%"
            ry="60%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor={color} stopOpacity={opacity * 0.9} />
            <Stop offset="35%" stopColor={color} stopOpacity={opacity * 0.45} />
            <Stop offset="65%" stopColor={color} stopOpacity={opacity * 0.2} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={radius} cy={radius} r={radius} fill={`url(#${gradientId})`} />
      </Svg>
    </View>
  );
};

