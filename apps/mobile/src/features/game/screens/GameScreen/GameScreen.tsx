import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BetBill } from "@/src/features/game/components/BetBill/BetBill";
import { BetBottomSheet } from "@/src/features/game/components/BetBottomSheet/BetBottomSheet";
import { DiceSumDisplay } from "@/src/features/game/components/DiceSumDisplay/DiceSumDisplay";
import { Dices } from "@/src/features/game/components/Dices/Dices";
import { ExitConfirmModal } from "@/src/features/game/components/ExitConfirmModal/ExitConfirmModal";
import { GameEndModal } from "@/src/features/game/components/GameEndModal/GameEndModal";
import { GameToast } from "@/src/features/game/components/GameToast/GameToast";
import { PlayerInfo } from "@/src/features/game/components/PlayerInfo/PlayerInfo";
import { PointDisplay } from "@/src/features/game/components/PointDisplay/PointDisplay";
import { WinningNumberFlyer } from "@/src/features/game/components/WinningNumberFlyer/WinningNumberFlyer";
import { GamePhase } from "@/src/features/game/enums/GamePhase";
import { PlayerRole } from "@/src/features/game/enums/PlayerRole";
import type { Player } from "@/src/features/game/types";
import { styles } from "@/src/features/game/screens/GameScreen/GameScreen.styles";
import type { GameScreenProps } from "@/src/features/game/screens/GameScreen/GameScreen.types";

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
  isExitConfirmVisible,
  onExitPress,
  onExitConfirm,
  onExitCancel,
}) => {
  const { t } = useLanguage();
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
          <View style={styles.topRow}>
            <Pressable
              style={styles.exitButton}
              onPress={onExitPress}
              accessibilityLabel={t("game.a11y.exitButton")}
              accessibilityRole="button"
            >
              <Ionicons
                name="exit-outline"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>
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
            onPress={isProcessing || isBetSheetVisible ? () => {} : onDicePress}
            disabled={isProcessing || isBetSheetVisible}
            accessibilityLabel={t("game.a11y.rollDice")}
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

        <ExitConfirmModal
          visible={isExitConfirmVisible}
          onConfirm={onExitConfirm}
          onCancel={onExitCancel}
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
