import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import React from "react";
import { View } from "react-native";
import { BetBottomSheet } from "../../components/BetBottomSheet/BetBottomSheet";
import { DiceSumDisplay } from "../../components/DiceSumDisplay/DiceSumDisplay";
import { Dices } from "../../components/Dices/Dices";
import { GameEndModal } from "../../components/GameEndModal/GameEndModal";
import { GameToast } from "../../components/GameToast/GameToast";
import { PlayerInfo } from "../../components/PlayerInfo/PlayerInfo";
import { PointDisplay } from "../../components/PointDisplay/PointDisplay";
import { GamePhase } from "../../enums/GamePhase";
import type { Player } from "../../types";
import { styles } from "./GameScreen.styles";
import type { GameScreenProps } from "./GameScreen.types";

export const GameScreen: React.FC<GameScreenProps> = ({
  player1,
  player2,
  phase,
  point,
  diceValues,
  isRolling,
  isProcessing,
  initialRolls,
  currentBet,
  minBet,
  bettorId,
  isBetSheetVisible,
  toastMessage,
  totalRounds,
  onDicePress,
  onOpenBetSheet,
  onSubmitBet,
  onGoHome,
}) => {
  const isInitialPhase = phase === GamePhase.INITIAL_ROLL;
  const isGameOver = phase === GamePhase.GAME_OVER;

  const activeBetter: Player | null =
    bettorId === "player1" ? player1 : bettorId === "player2" ? player2 : null;

  const maxBet = activeBetter?.currentMoney ?? minBet;
  const isFirstBet = currentBet === minBet;

  const winner =
    player1.currentMoney >= player2.currentMoney ? player1 : player2;
  const loser = winner.id === "player1" ? player2 : player1;

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
            label={player2.name ?? "Player 2"}
            value={initialRolls.player2 ?? null}
            visible={isInitialPhase}
          />
          {!isInitialPhase && point !== null && <PointDisplay point={point} />}
          <Dices
            diceValues={diceValues}
            isRolling={isRolling}
            onPress={isProcessing ? () => {} : onDicePress}
          />
          <DiceSumDisplay
            label={player1.name ?? "Player 1"}
            value={initialRolls.player1 ?? null}
            visible={isInitialPhase}
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

        <GameToast
          message={toastMessage}
          onDismiss={() => {}}
        />

        <BetBottomSheet
          visible={isBetSheetVisible}
          player={activeBetter}
          currentBet={currentBet}
          minBet={minBet}
          maxBet={maxBet}
          isFirstBet={isFirstBet}
          onClose={onOpenBetSheet}
          onSubmitBet={onSubmitBet}
        />

        {isGameOver && (
          <GameEndModal
            visible={isGameOver}
            winner={winner}
            loser={loser}
            totalRounds={totalRounds}
            onGoHome={onGoHome}
          />
        )}
      </View>
    </ScreenContainer>
  );
};
