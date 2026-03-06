import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import { BetBottomSheet } from "@/src/features/game/components/BetBottomSheet/BetBottomSheet";
import { ExitConfirmModal } from "@/src/features/game/components/ExitConfirmModal/ExitConfirmModal";
import { GameEndModal } from "@/src/features/game/components/GameEndModal/GameEndModal";
import { GameToast } from "@/src/features/game/components/GameToast/GameToast";
import { WinningNumberFlyer } from "@/src/features/game/components/WinningNumberFlyer/WinningNumberFlyer";
import { GamePhase } from "@/src/features/game/enums/GamePhase";
import { useGameDerivedState } from "@/src/features/game/hooks/useGameDerivedState";
import { GameBoardBottom } from "@/src/features/game/screens/GameScreen/GameBoardBottom";
import { GameBoardMiddle } from "@/src/features/game/screens/GameScreen/GameBoardMiddle";
import { GameBoardTop } from "@/src/features/game/screens/GameScreen/GameBoardTop";
import type { GameScreenProps } from "@/src/features/game/screens/GameScreen/GameScreen.types";
import React from "react";
import { StyleSheet, View } from "react-native";

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
  actionCountdownProgress,
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
  const isInitialPhase = phase === GamePhase.INITIAL_ROLL;
  const isGameOver = phase === GamePhase.GAME_OVER;

  const { activeBetter, maxBet, isFirstBet, canUnlock, winner, loser } =
    useGameDerivedState({ player1, player2, bettorId, currentBet, minBet });

  return (
    <ScreenContainer>
      <View style={{ flex: 1 }}>
        <GameBoardTop
          player={player2}
          isInitialPhase={isInitialPhase}
          currentBet={currentBet}
          bettorId={bettorId}
          keepBet={keepBet}
          canUnlock={canUnlock}
          lastWinnerId={lastWinnerId}
          lastWinningNumber={lastWinningNumber}
          onExitPress={onExitPress}
          onKeepBetChange={onKeepBetChange}
          countdownProgress={player2.isActive ? actionCountdownProgress : null}
        />

        <GameBoardMiddle
          player1={player1}
          player2={player2}
          isInitialPhase={isInitialPhase}
          point={point}
          diceValues={diceValues}
          isRolling={isRolling}
          isInteractionBlocked={isProcessing || isBetSheetVisible}
          initialRolls={initialRolls}
          onDicePress={onDicePress}
        />

        <GameBoardBottom
          player={player1}
          isInitialPhase={isInitialPhase}
          currentBet={currentBet}
          bettorId={bettorId}
          keepBet={keepBet}
          canUnlock={canUnlock}
          lastWinnerId={lastWinnerId}
          lastWinningNumber={lastWinningNumber}
          onKeepBetChange={onKeepBetChange}
          countdownProgress={player1.isActive ? actionCountdownProgress : null}
        />

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
          countdownProgress={isBetSheetVisible ? actionCountdownProgress : null}
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
