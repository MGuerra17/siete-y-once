import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import React from "react";
import { View } from "react-native";
import { BetBottomSheet } from "../../components/BetBottomSheet/BetBottomSheet";
import { DiceSumDisplay } from "../../components/DiceSumDisplay/DiceSumDisplay";
import { Dices } from "../../components/Dices/Dices";
import { PlayerInfo } from "../../components/PlayerInfo/PlayerInfo";
import { PointDisplay } from "../../components/PointDisplay/PointDisplay";
import { GameEndModal } from "../../components/GameEndModal/GameEndModal";
import { GameToast } from "../../components/GameToast/GameToast";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import type { Player } from "../../types";
import { styles } from "./GameScreen.styles";
import { GameScreenProps } from "./GameScreen.types";

export const GameScreen: React.FC<GameScreenProps> = ({
  player1,
  player2,
  activeBetterId,
  currentBet,
  minBet,
  point,
  diceValues,
  isRolling,
  lastRollSumPlayer1,
  lastRollSumPlayer2,
  onDicePress,
  onOpenBetSheet,
  onSubmitBet,
  isBetSheetVisible,
  endModalProps,
  toastProps,
}) => {
  const { t } = useLanguage();
  const activeBetter: Player | null =
    activeBetterId === "player1"
      ? player1
      : activeBetterId === "player2"
        ? player2
        : null;

  const maxBet = activeBetter?.currentMoney ?? minBet;
  const isFirstBet = currentBet === minBet;

  return (
    <ScreenContainer>
      <View style={{ flex: 1 }}>
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
          <DiceSumDisplay
            label={t("game.lastRollSumPlayer2Label")}
            value={lastRollSumPlayer2}
          />
          <PointDisplay point={point} />
          <Dices
            diceValues={diceValues}
            isRolling={isRolling}
            onPress={onDicePress}
          />
          <DiceSumDisplay
            label={t("game.lastRollSumPlayer1Label")}
            value={lastRollSumPlayer1}
            invertOrder
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

        {toastProps && (
          <GameToast
            message={toastProps.message}
            duration={toastProps.duration}
            onDismiss={toastProps.onDismiss}
          />
        )}

        <BetBottomSheet
          visible={isBetSheetVisible}
          player={activeBetter}
          currentBet={currentBet}
          minBet={minBet}
          maxBet={maxBet}
          isFirstBet={isFirstBet}
          onClose={() => {
            // Sheet cannot be dismissed without a bet; keep it visible.
            onOpenBetSheet();
          }}
          onSubmitBet={onSubmitBet}
        />

        {endModalProps?.visible && (
          <GameEndModal {...endModalProps} />
        )}
      </View>
    </ScreenContainer>
  );
};
