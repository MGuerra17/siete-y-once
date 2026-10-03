import { useLanguage } from "@/src/core/hooks/useLanguage";
import { GameMode } from "@/src/features/game/enums/GameMode";
import { GamePhase } from "@/src/features/game/enums/GamePhase";
import { useActionTimer } from "@/src/features/game/hooks/useActionTimer";
import { useExitConfirm } from "@/src/features/game/hooks/useExitConfirm";
import { useGameDerivedState } from "@/src/features/game/hooks/useGameDerivedState";
import {
  getCurrentActionPlayerId,
  useAutoKeepBet,
  useGameWinEffects,
  useShareGameResultHandler,
} from "@/src/features/game/hooks/useBaseGameScreen";
import { useLocalGameEngine } from "@/src/features/game/hooks/useLocalGameEngine";
import type { GameScreenProps } from "@/src/features/game/screens/GameScreen/GameScreen.types";
import { useGameStore } from "@/src/features/game/store/gameStore";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import type { PlayerId } from "@/src/features/game/types";
import { useShallow } from "zustand/shallow";

type UseOfflineGameScreenResult = {
  screenProps: GameScreenProps;
};

export const useOfflineGameScreen = (): UseOfflineGameScreenResult => {
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

  const router = useRouter();
  const { t } = useLanguage();
  const navigation = useNavigation();

  const engine = useLocalGameEngine();

  const currentActionPlayerId: PlayerId | null = getCurrentActionPlayerId({
    phase,
    activeInitialRollerId,
    bettorId,
    shooterId,
  });

  const isDiceEnabled =
    !isRolling &&
    ((phase === GamePhase.INITIAL_ROLL && true) ||
      ((phase === GamePhase.SHOOTER_ROLLING ||
        phase === GamePhase.WAITING_FOR_ROLL) &&
        true));

  const actionCountdownProgress = useActionTimer({
    phase,
    isBetSheetVisible,
    isProcessing,
    isRolling,
    onExpire: engine.performDefaultAction,
  });

  const { maxBet, winner, loser } = useGameDerivedState({
    player1,
    player2,
    bettorId,
    currentBet,
    minBet,
    lastWinnerId,
  });

  const { playBetSound } = useGameWinEffects({
    mode: GameMode.OFFLINE,
    isRolling,
    phase,
    lastWinnerId: lastWinnerId ?? null,
  });

  useAutoKeepBet({ currentBet, maxBet, setKeepBet });

  const handleGoHome = useCallback(() => {
    resetGame();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [resetGame, router]);

  const exitConfirm = useExitConfirm(handleGoHome);

  // Run once on mount: disable back gesture and show initial roll toast.
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
    if (phase === GamePhase.INITIAL_ROLL) {
      setToastMessage(t("game.toast.rollToDetermineShooter"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only effect
  }, []);

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
  const { captureRef, handleShare } = useShareGameResultHandler({
    winner,
    loser,
    totalRounds,
    t: t as (key: string) => string,
  });

  const screenProps: GameScreenProps = {
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
    actionCountdownPlayerId: currentActionPlayerId,
    isOnline: false,
    isDiceEnabled,
    actionCountdownProgress: actionCountdownProgress ?? null,
    onDicePress: engine.onDicePress,
    onOpenBetSheet: engine.onOpenBetSheet,
    onKeepBetChange: handleKeepBetChange,
    onSubmitBet: handleSubmitBet,
    onDismissToast: () => setToastMessage(null),
    onGoHome: handleGoHome,
    onShare: handleShare,
    captureRef,
    isExitConfirmVisible: exitConfirm.isVisible,
    onExitPress: exitConfirm.show,
    onExitConfirm: exitConfirm.confirm,
    onExitCancel: exitConfirm.hide,
  };

  return { screenProps };
};
