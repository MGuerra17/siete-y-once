import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "./PrimaryButton.styles";
import { PrimaryButtonProps } from "./PrimaryButton.types";

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

