import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BetBill } from "../../components/BetBill/BetBill";
import { BetBottomSheet } from "../../components/BetBottomSheet/BetBottomSheet";
import { DiceSumDisplay } from "../../components/DiceSumDisplay/DiceSumDisplay";
import { Dices } from "../../components/Dices/Dices";
import { GameEndModal } from "../../components/GameEndModal/GameEndModal";
import { GameToast } from "../../components/GameToast/GameToast";
import { PlayerInfo } from "../../components/PlayerInfo/PlayerInfo";
import { PointDisplay } from "../../components/PointDisplay/PointDisplay";
import { WinningNumberFlyer } from "../../components/WinningNumberFlyer/WinningNumberFlyer";
import { GamePhase } from "../../enums/GamePhase";
import { PlayerRole } from "../../enums/PlayerRole";
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
  keepBet,
  isBetSheetVisible,
  toastMessage,
  totalRounds,
  lastWinnerId,
  lastWinningNumber,
  onDicePress,
  onOpenBetSheet,
  onKeepBetChange,
  onSubmitBet,
  onDismissToast,
  onGoHome,
  onShare,
  captureRef,
}) => {
  const isInitialPhase = phase === GamePhase.INITIAL_ROLL;
  const isGameOver = phase === GamePhase.GAME_OVER;

  const activeBetter: Player | null =
    bettorId === "player1" ? player1 : bettorId === "player2" ? player2 : null;

  const maxBet = activeBetter?.currentMoney ?? minBet;
  const isFirstBet = currentBet === 0;
  const canUnlock = currentBet < maxBet;

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
            role={isInitialPhase ? PlayerRole.ROLLER : player2.currentRole}
            winningNumbers={player2.winningNumbers}
            isActive={player2.isActive}
            activeWinningNumber={
              lastWinnerId === player2.id ? lastWinningNumber : null
            }
          />
          <View style={styles.betBillContainer}>
            <BetBill
              amount={currentBet}
              centered
              visible={bettorId === "player2"}
              keepBet={keepBet}
              onKeepBetToggle={() => onKeepBetChange(!keepBet)}
              showLockButton={bettorId === "player2" && currentBet > 0}
              lockPermanent={keepBet && !canUnlock}
            />
          </View>
        </View>

        <View style={styles.middle}>
          <View style={styles.middleSlot}>
            {isInitialPhase ? (
              <DiceSumDisplay
                label={player2.name ?? "Player 2"}
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
            onPress={isProcessing ? () => {} : onDicePress}
          />
          <View style={styles.middleSlot}>
            {isInitialPhase ? (
              <DiceSumDisplay
                label={player1.name ?? "Player 1"}
                value={initialRolls.player1 ?? null}
                visible
                invertOrder
              />
            ) : null}
          </View>
        </View>

        <View style={styles.bottom}>
          <View style={styles.betBillContainer}>
            <BetBill
              amount={currentBet}
              centered
              visible={bettorId === "player1"}
              keepBet={keepBet}
              onKeepBetToggle={() => onKeepBetChange(!keepBet)}
              showLockButton={bettorId === "player1" && currentBet > 0}
              lockPermanent={keepBet && !canUnlock}
            />
          </View>
          <PlayerInfo
            id={player1.id}
            name={player1.name}
            imageUri={player1.imageUri}
            currentMoney={player1.currentMoney}
            role={isInitialPhase ? PlayerRole.ROLLER : player1.currentRole}
            winningNumbers={player1.winningNumbers}
            isActive={player1.isActive}
            activeWinningNumber={
              lastWinnerId === player1.id ? lastWinningNumber : null
            }
          />
        </View>

        <GameToast message={toastMessage} onDismiss={onDismissToast} />

        <BetBottomSheet
          visible={isBetSheetVisible}
          player={activeBetter}
          currentBet={currentBet}
          minBet={minBet}
          maxBet={maxBet}
          isFirstBet={isFirstBet}
          onClose={() => {}}
          onSubmitBet={onSubmitBet}
        />

        {isGameOver && (
          <GameEndModal
            visible={isGameOver}
            winner={winner}
            loser={loser}
            totalRounds={totalRounds}
            onGoHome={onGoHome}
            onShare={onShare}
            captureRef={captureRef}
          />
        )}

        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {lastWinnerId != null && lastWinningNumber != null && (
            <WinningNumberFlyer
              key={`${lastWinnerId}-${lastWinningNumber}-${totalRounds}`}
              number={lastWinningNumber}
              playerId={lastWinnerId}
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};
