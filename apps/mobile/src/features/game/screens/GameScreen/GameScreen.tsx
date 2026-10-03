import React from "react";
import { StyleSheet, View } from "react-native";
import { GamePhase } from "@seven/game-core";
import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import { BetBottomSheet } from "@/src/features/game/components/BetBottomSheet/BetBottomSheet";
import { ExitConfirmModal } from "@/src/features/game/components/ExitConfirmModal/ExitConfirmModal";
import { GameBoardBottom } from "@/src/features/game/components/GameBoardBottom/GameBoardBottom";
import { GameBoardMiddle } from "@/src/features/game/components/GameBoardMiddle/GameBoardMiddle";
import { GameBoardTop } from "@/src/features/game/components/GameBoardTop/GameBoardTop";
import { GameEndModal } from "@/src/features/game/components/GameEndModal/GameEndModal";
import { GameToast } from "@/src/features/game/components/GameToast/GameToast";
import { StatusBanner } from "@/src/features/game/components/StatusBanner/StatusBanner";
import { WinningNumberFlyer } from "@/src/features/game/components/WinningNumberFlyer/WinningNumberFlyer";
import { styles } from "@/src/features/game/screens/GameScreen/GameScreen.styles";
import type { GameScreenProps } from "@/src/features/game/screens/GameScreen/GameScreen.types";
import { GameModes } from "@/src/features/game/types";

const noop = () => {};

export const GameScreen: React.FC<GameScreenProps> = ({
  board,
  mode,
  isRolling,
  isDiceEnabled,
  isBetSheetVisible,
  toastMessage,
  statusMessage = null,
  flyer,
  lockableSeats,
  onDicePress,
  onSubmitBet,
  onToggleBetLock,
  onDismissToast,
  onGoHome,
  onShare,
  captureRef,
  exit,
}) => {
  const { player1, player2, bettorId, currentBet, betLocked, maxBet } = board;
  const isInitialPhase = board.phase === GamePhase.INITIAL_ROLL;
  const isGameOver = board.phase === GamePhase.GAME_OVER;
  const canUnlock = currentBet < maxBet;
  const activeBettor = bettorId === "player1" ? player1 : bettorId === "player2" ? player2 : null;
  const flyerNumberFor = (seat: "player1" | "player2") =>
    flyer?.playerId === seat ? flyer.number : null;

  return (
    <ScreenContainer withBottomInset>
      <View style={styles.board}>
        <GameBoardTop
          player={player2}
          isInitialPhase={isInitialPhase}
          currentBet={currentBet}
          bettorId={bettorId}
          keepBet={betLocked}
          canUnlock={canUnlock}
          lastWinnerId={flyer?.playerId ?? null}
          lastWinningNumber={flyerNumberFor("player2")}
          onExitPress={exit.onPress}
          onKeepBetChange={onToggleBetLock}
          canToggleLock={lockableSeats.top}
        />

        <GameBoardMiddle
          player1={player1}
          player2={player2}
          isInitialPhase={isInitialPhase}
          point={board.point}
          diceValues={board.diceValues}
          isRolling={isRolling}
          isInteractionBlocked={!isDiceEnabled}
          initialRolls={board.initialRolls}
          onDicePress={onDicePress}
        />

        <GameBoardBottom
          player={player1}
          isInitialPhase={isInitialPhase}
          currentBet={currentBet}
          bettorId={bettorId}
          keepBet={betLocked}
          canUnlock={canUnlock}
          lastWinnerId={flyer?.playerId ?? null}
          lastWinningNumber={flyerNumberFor("player1")}
          onKeepBetChange={onToggleBetLock}
          canToggleLock={lockableSeats.bottom}
        />

        <GameToast message={toastMessage} onDismiss={onDismissToast} />
        <StatusBanner message={statusMessage} />

        <BetBottomSheet
          visible={isBetSheetVisible}
          player={activeBettor}
          currentBet={currentBet}
          minBet={board.minBet}
          maxBet={maxBet}
          isFirstBet={board.isFirstBet}
          onClose={noop}
          onSubmitBet={onSubmitBet}
        />

        <ExitConfirmModal visible={exit.visible} onConfirm={exit.onConfirm} onCancel={exit.onCancel} />

        {isGameOver && board.winner && board.loser && (
          <GameEndModal
            visible
            winner={board.winner}
            loser={board.loser}
            totalRounds={board.totalRounds}
            isOnline={mode === GameModes.ONLINE}
            onGoHome={onGoHome}
            onShare={onShare}
            captureRef={captureRef}
          />
        )}

        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {flyer && (
            <WinningNumberFlyer key={flyer.key} number={flyer.number} playerId={flyer.playerId} />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};
