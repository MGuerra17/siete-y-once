import React from "react";
import { Text, View } from "react-native";
import { styles } from "./BetSubmitButton.styles";
import { BetSubmitButtonProps } from "./BetSubmitButton.types";

export const BetSubmitButton: React.FC<BetSubmitButtonProps> = ({
  label,
  disabled,
  onPress,
}) => {
  return (
    <View
      style={[styles.submitButton, disabled && styles.submitButtonDisabled]}
    >
      <Text
        style={[
          styles.submitButtonText,
          disabled && styles.submitButtonTextDisabled,
        ]}
        onPress={disabled ? undefined : onPress}
      >
        {label}
      </Text>
    </View>
  );
};
