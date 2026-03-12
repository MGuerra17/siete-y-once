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
import { useOnlineGameEngine } from "@/src/features/online/hooks/useOnlineGameEngine";
import { wsService } from "@/src/features/online/services/WebSocketService";
import { useOnlineStore } from "@/src/features/online/store/onlineStore";
import { clearSession } from "@/src/features/online/utils/storage";
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
    shooterId,
    activeInitialRollerId,
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
      shooterId: s.shooterId,
      activeInitialRollerId: s.activeInitialRollerId,
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
  const isOnline = mode === GameMode.ONLINE;
  const router = useRouter();
  const { t } = useLanguage();
  const navigation = useNavigation();

  const localEngine = useLocalGameEngine();
  const onlineEngine = useOnlineGameEngine();
  const engine = isOnline ? onlineEngine : localEngine;

  const isLocalPlayerActive = isOnline
    ? phase === GamePhase.INITIAL_ROLL
      ? activeInitialRollerId === "player1"
      : phase === GamePhase.BET_PLACEMENT || phase === GamePhase.POINT_PHASE
        ? bettorId === "player1"
        : (phase === GamePhase.SHOOTER_ROLLING ||
            phase === GamePhase.WAITING_FOR_ROLL) &&
          shooterId === "player1"
    : player1.isActive;
  const effectiveProcessing = isOnline
    ? isProcessing || !isLocalPlayerActive
    : isProcessing;

  const isDiceEnabled =
    !isRolling &&
    ((phase === GamePhase.INITIAL_ROLL &&
      (isOnline ? activeInitialRollerId === "player1" : player1.isActive)) ||
      ((phase === GamePhase.SHOOTER_ROLLING ||
        phase === GamePhase.WAITING_FOR_ROLL) &&
        (isOnline ? shooterId === "player1" : player1.isActive)));

  const actionCountdownProgress = useActionTimer({
    phase,
    isBetSheetVisible,
    isProcessing: effectiveProcessing,
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
    if (isOnline) {
      wsService.disconnect();
      useOnlineStore.getState().reset();
      clearSession();
    }
    resetGame();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [resetGame, router, isOnline]);

  const exitConfirm = useExitConfirm(handleGoHome);

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
    if (!isOnline && phase === GamePhase.INITIAL_ROLL) {
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

  const handleKeepBetChange = useCallback(
    (value: boolean) => {
      setKeepBet(value);
    },
    [setKeepBet],
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
      isProcessing={effectiveProcessing}
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
      isOnline={isOnline}
      isDiceEnabled={isDiceEnabled}
      actionCountdownProgress={actionCountdownProgress ?? null}
      onDicePress={engine.onDicePress}
      onOpenBetSheet={engine.onOpenBetSheet}
      onKeepBetChange={handleKeepBetChange}
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
