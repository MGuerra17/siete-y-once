import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "@/src/core/components/PrimaryButton/PrimaryButton.styles";
import { PrimaryButtonProps } from "@/src/core/components/PrimaryButton/PrimaryButton.types";

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled,
  style,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

