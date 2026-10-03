import React from "react";
import { View } from "react-native";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { DiceSumDisplay } from "@/src/features/game/components/DiceSumDisplay/DiceSumDisplay";
import { Dices } from "@/src/features/game/components/Dices/Dices";
import { PointDisplay } from "@/src/features/game/components/PointDisplay/PointDisplay";
import type { GameBoardMiddleProps } from "@/src/features/game/components/GameBoardMiddle/GameBoardMiddle.types";
import { styles } from "@/src/features/game/components/GameBoardMiddle/GameBoardMiddle.styles";
import { getPlayerDisplayName } from "@/src/features/game/utils/playerDisplayName";

/** Middle section of the game board: dice sum displays / point, and the dice. */
export const GameBoardMiddle: React.FC<GameBoardMiddleProps> = ({
  player1,
  player2,
  isInitialPhase,
  point,
  diceValues,
  isRolling,
  isInteractionBlocked,
  initialRolls,
  onDicePress,
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.middle}>
      <View style={styles.middleSlot}>
        {isInitialPhase ? (
          <DiceSumDisplay
            label={getPlayerDisplayName(player2, t)}
            value={initialRolls.player2 ?? null}
            visible
          />
        ) : point !== null ? (
          <PointDisplay point={point} />
        ) : null}
      </View>
      <Dices
        diceValues={diceValues}
        isRolling={isRolling}
        onPress={isInteractionBlocked ? () => {} : onDicePress}
        disabled={isInteractionBlocked}
        accessibilityLabel={t("game.a11y.rollDice")}
      />
      <View style={styles.middleSlot}>
        {isInitialPhase ? (
          <DiceSumDisplay
            label={getPlayerDisplayName(player1, t)}
            value={initialRolls.player1 ?? null}
            visible
            invertOrder
          />
        ) : null}
      </View>
    </View>
  );
};

