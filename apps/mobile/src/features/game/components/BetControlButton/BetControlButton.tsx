import { colors } from "@/src/theme/colors";
import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "./BetControlButton.styles";
import { BetControlButtonProps } from "./BetControlButton.types";

export const BetControlButton: React.FC<BetControlButtonProps> = ({
  label,
  type,
  disabled,
  small,
  onPress,
}) => {
  const borderColor = type === "increase" ? colors.success : colors.danger;

  return (
    <Pressable
      style={[
        styles.controlButton,
        small && styles.controlButtonSmall,
        { borderColor },
        disabled && styles.controlButtonDisabled,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.controlButtonText,
          disabled && styles.controlButtonTextDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};
