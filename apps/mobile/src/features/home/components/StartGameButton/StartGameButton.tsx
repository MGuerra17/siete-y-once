import React from "react";
import { View } from "react-native";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { spacing } from "@/src/theme/spacing";
import { StartGameButtonProps } from "@/src/features/home/components/StartGameButton/StartGameButton.types";
import { styles } from "@/src/features/home/components/StartGameButton/StartGameButton.styles";

export const StartGameButton: React.FC<StartGameButtonProps> = ({
  label,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <PrimaryButton
        label={label}
        onPress={onPress}
        style={styles.button}
      />
    </View>
  );
};

