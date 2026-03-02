import React from "react";
import { View } from "react-native";
import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import { PlayerInfo } from "../../components/PlayerInfo/PlayerInfo";
import { PointDisplay } from "../../components/PointDisplay/PointDisplay";
import { Dices } from "../../components/Dices/Dices";
import { styles } from "./GameScreen.styles";
import { GameScreenProps } from "./GameScreen.types";

export const GameScreen: React.FC<GameScreenProps> = ({
  player1,
  player2,
  point,
  diceValues,
  isRolling,
  onDicePress,
}) => {
  return (
    <ScreenContainer>
      <View style={styles.top}>
        <PlayerInfo
          id={player2.id}
          name={player2.name}
          imageUri={player2.imageUri}
          currentMoney={player2.currentMoney}
          role={player2.currentRole}
          winningNumbers={player2.winningNumbers}
          isActive={player2.isActive}
        />
      </View>

      <View style={styles.middle}>
        <PointDisplay point={point} />
        <Dices
          diceValues={diceValues}
          isRolling={isRolling}
          onPress={onDicePress}
        />
      </View>

      <View style={styles.bottom}>
        <PlayerInfo
          id={player1.id}
          name={player1.name}
          imageUri={player1.imageUri}
          currentMoney={player1.currentMoney}
          role={player1.currentRole}
          winningNumbers={player1.winningNumbers}
          isActive={player1.isActive}
        />
      </View>
    </ScreenContainer>
  );
};

