import React from "react";
import { View } from "react-native";
import { Dice } from "../Dice/Dice";
import { styles } from "./Dices.styles";
import { DicesProps } from "./Dices.types";

export const Dices: React.FC<DicesProps> = ({
  diceValues,
  isRolling,
  onPress,
  disabled,
}) => {
  return (
    <View style={styles.container}>
      <Dice
        value={diceValues[0]}
        isRolling={isRolling}
        onPress={onPress}
        disabled={disabled}
      />
      <Dice
        value={diceValues[1]}
        isRolling={isRolling}
        onPress={onPress}
        disabled={disabled}
      />
    </View>
  );
};

