import { useLanguage } from "@/src/core/hooks/useLanguage";
import { GameMode } from "@/src/features/game/enums/GameMode";
import { GamePhase } from "@/src/features/game/enums/GamePhase";
import { useActionTimer } from "@/src/features/game/hooks/useActionTimer";
import { useExitConfirm } from "@/src/features/game/hooks/useExitConfirm";
import { useGameDerivedState } from "@/src/features/game/hooks/useGameDerivedState";
import { useGameSounds } from "@/src/features/game/hooks/useGameSounds";
import { useLocalGameEngine } from "@/src/features/game/hooks/useLocalGameEngine";
import { GameScreen } from "@/src/features/game/screens/GameScreen/GameScreen";
import { useGameStore } from "@/src/features/game/store/gameStore";
import { shareGameResult } from "@/src/features/game/utils/shareGameResult";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";

export const GameScreenContainer: React.FC = () => {
  const {
    phase,
    isRolling,
    player1,
    player2,
    point,
    diceValues,
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
    setKeepBet,
    resetGame,
    setToastMessage,
  } = useGameStore(
    useShallow((s) => ({
      phase: s.phase,
      isRolling: s.isRolling,
      player1: s.player1,
      player2: s.player2,
      point: s.point,
      diceValues: s.diceValues,
      isProcessing: s.isProcessing,
      initialRolls: s.initialRolls,
      currentBet: s.currentBet,
      minBet: s.minBet,
      bettorId: s.bettorId,
      keepBet: s.keepBet,
      isBetSheetVisible: s.isBetSheetVisible,
      toastMessage: s.toastMessage,
      totalRounds: s.totalRounds,
      lastWinnerId: s.lastWinnerId,
      lastWinningNumber: s.lastWinningNumber,
      setKeepBet: s.setKeepBet,
      resetGame: s.resetGame,
      setToastMessage: s.setToastMessage,
    })),
  );

  const { mode } = useLocalSearchParams<{ mode?: GameMode }>();
  const router = useRouter();
  const { t } = useLanguage();
  const navigation = useNavigation();

  const engine = useLocalGameEngine();

  const actionCountdownProgress = useActionTimer({
    phase,
    isBetSheetVisible,
    isProcessing,
    isRolling,
    onExpire: engine.performDefaultAction,
  });

  const { playBetSound, playWinRoundSound, playWinGameSound } = useGameSounds(
    mode,
    isRolling,
  );

  const { maxBet, winner, loser } = useGameDerivedState({
    player1,
    player2,
    bettorId,
    currentBet,
    minBet,
  });

  const handleGoHome = useCallback(() => {
    resetGame();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [resetGame, router]);

  const exitConfirm = useExitConfirm(handleGoHome);

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
    if (phase === GamePhase.INITIAL_ROLL) {
      setToastMessage(t("game.toast.rollToDetermineShooter"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentBet > 0 && currentBet >= maxBet) {
      setKeepBet(true);
    }
  }, [currentBet, maxBet, setKeepBet]);

  useEffect(() => {
    if (lastWinnerId) playWinRoundSound();
  }, [lastWinnerId, playWinRoundSound]);

  const prevPhase = useRef(phase);

  useEffect(() => {
    const justEnteredGameOver =
      phase === GamePhase.GAME_OVER &&
      prevPhase.current !== GamePhase.GAME_OVER;
    prevPhase.current = phase;
    if (justEnteredGameOver) playWinGameSound();
  }, [phase, playWinGameSound]);

  const handleSubmitBet = useCallback(
    (amount: number) => {
      engine.onBetSubmit(amount);
      playBetSound();
    },
    [engine, playBetSound],
  );

  const captureRef = useRef<View>(null);

  const handleShare = useCallback(() => {
    shareGameResult(
      captureRef,
      winner,
      loser,
      totalRounds,
      t as (key: string) => string,
    );
  }, [winner, loser, totalRounds, t]);

  return (
    <GameScreen
      player1={player1}
      player2={player2}
      phase={phase}
      point={point}
      diceValues={diceValues}
      isRolling={isRolling}
      isProcessing={isProcessing}
      initialRolls={initialRolls}
      currentBet={currentBet}
      minBet={minBet}
      bettorId={bettorId}
      keepBet={keepBet}
      isBetSheetVisible={isBetSheetVisible}
      toastMessage={toastMessage}
      totalRounds={totalRounds}
      lastWinnerId={lastWinnerId}
      lastWinningNumber={lastWinningNumber}
      actionCountdownProgress={actionCountdownProgress ?? null}
      onDicePress={engine.onDicePress}
      onOpenBetSheet={engine.onOpenBetSheet}
      onKeepBetChange={setKeepBet}
      onSubmitBet={handleSubmitBet}
      onDismissToast={() => setToastMessage(null)}
      onGoHome={handleGoHome}
      onShare={handleShare}
      captureRef={captureRef}
      isExitConfirmVisible={exitConfirm.isVisible}
      onExitPress={exitConfirm.show}
      onExitConfirm={exitConfirm.confirm}
      onExitCancel={exitConfirm.hide}
    />
  );
};
