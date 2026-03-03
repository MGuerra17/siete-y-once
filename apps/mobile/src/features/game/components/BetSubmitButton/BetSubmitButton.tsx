import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "./BetSubmitButton.styles";
import { BetSubmitButtonProps } from "./BetSubmitButton.types";

export const BetSubmitButton: React.FC<BetSubmitButtonProps> = ({
  label,
  disabled,
  onPress,
}) => {
  return (
    <Pressable
      style={[styles.submitButton, disabled && styles.submitButtonDisabled]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.submitButtonText,
          disabled && styles.submitButtonTextDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};
