import React from "react";
import { Image, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { styles } from "@/src/core/components/Avatar/Avatar.styles";
import { AvatarProps } from "@/src/core/components/Avatar/Avatar.types";

const BORDER_WIDTH = 2;

/** Circular avatar with image or person-icon fallback. Highlights when `isActive` is true. */
export const Avatar: React.FC<AvatarProps> = ({
  imageUri,
  isActive = false,
  size = 56,
  fallbackLabel = "?",
  countdownProgress = null,
}) => {
  const showCountdownRing =
    isActive &&
    countdownProgress != null &&
    countdownProgress >= 0 &&
    countdownProgress <= 1;

  const radius = size / 2 - BORDER_WIDTH / 2;
  const circumference = 2 * Math.PI * radius;
  const visibleLength = showCountdownRing
    ? Math.max(0, (1 - countdownProgress) * circumference)
    : 0;

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    showCountdownRing ? styles.countdownBorder : isActive ? styles.activeBorder : styles.inactiveBorder,
  ];

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <View style={containerStyle}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: size / 2,
            }}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholder, { borderRadius: size / 2 }]}>
            <Ionicons
              name="person"
              size={size * 0.5}
              color={colors.textSecondary}
            />
          </View>
        )}
      </View>
      {showCountdownRing && (
        <Svg
          width={size}
          height={size}
          style={styles.countdownRing}
          pointerEvents="none"
        >
          <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.primary}
              strokeWidth={BORDER_WIDTH}
              fill="none"
              strokeDasharray={`${visibleLength} ${circumference}`}
              strokeLinecap="round"
            />
          </G>
        </Svg>
      )}
    </View>
  );
};

