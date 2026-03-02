import React from "react";
import { View } from "react-native";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { StartGameButtonProps } from "./StartGameButton.types";

export const StartGameButton: React.FC<StartGameButtonProps> = ({
  label,
  onPress,
}) => {
  return (
    <View>
      <PrimaryButton label={label} onPress={onPress} />
    </View>
  );
};

