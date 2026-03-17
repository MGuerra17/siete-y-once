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
import type { GameScreenProps } from "@/src/features/game/screens/GameScreen/GameScreen.types";
import { useGameStore } from "@/src/features/game/store/gameStore";
import { useOnlineGameEngine } from "@/src/features/online/hooks/useOnlineGameEngine";
import { wsService } from "@/src/features/online/services/WebSocketService";
import { useOnlineStore } from "@/src/features/online/store/onlineStore";
import { clearSession } from "@/src/features/online/utils/storage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useState } from "react";
import type { PlayerId } from "@/src/features/game/types";
import { useShallow } from "zustand/shallow";

type UseOnlineGameScreenResult = {
  screenProps: GameScreenProps;
  isOnline: boolean;
  isCreator: boolean;
  showCodeModal: boolean;
  shortCode: string | null;
  handleCopyCode: () => Promise<void>;
  handleGoHome: () => void;
};

export const useOnlineGameScreen = (): UseOnlineGameScreenResult => {
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

  const { mode, showCode } = useLocalSearchParams<{
    mode?: GameMode;
    showCode?: string;
  }>();

  const isOnline = mode === GameMode.ONLINE;

  const router = useRouter();
  const { t } = useLanguage();
  const navigation = useNavigation();

  const engine = useOnlineGameEngine();

  const shortCode = useOnlineStore((s) => s.shortCode);
  const isCreator = useOnlineStore((s) => s.isCreator);
  const opponentConnected = useOnlineStore((s) => s.opponentConnected);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const currentActionPlayerId: PlayerId | null = getCurrentActionPlayerId({
    phase,
    activeInitialRollerId,
    bettorId,
    shooterId,
  });

  const isLocalPlayerActive =
    isOnline && currentActionPlayerId
      ? currentActionPlayerId === "player1"
      : player1.isActive;

  const isWaitingForOpponent =
    isOnline && isCreator && !opponentConnected && showCode === "1";

  const effectiveProcessing = isOnline
    ? isProcessing || !isLocalPlayerActive
    : isProcessing;

  const isDiceEnabled =
    !isRolling &&
    ((phase === GamePhase.INITIAL_ROLL &&
      (isOnline ? activeInitialRollerId === "player1" : true)) ||
      ((phase === GamePhase.SHOOTER_ROLLING ||
        phase === GamePhase.WAITING_FOR_ROLL) &&
        (isOnline ? shooterId === "player1" : true)));

  const actionCountdownProgress = useActionTimer({
    phase,
    isBetSheetVisible,
    isProcessing: effectiveProcessing || isWaitingForOpponent,
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
    mode: GameMode.ONLINE,
    isRolling,
    phase,
    lastWinnerId: lastWinnerId ?? null,
  });

  useAutoKeepBet({ currentBet, maxBet, setKeepBet });

  const handleGoHome = useCallback(() => {
    wsService.disconnect();
    useOnlineStore.getState().reset();
    clearSession();
    resetGame();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [resetGame, router]);

  const exitConfirm = useExitConfirm(handleGoHome);

  useEffect(() => {
    if (!isOnline) return;
    navigation.setOptions({ gestureEnabled: false });
    // Mensaje inicial para offline ya se maneja en el hook offline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

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

  const handleCopyCode = useCallback(async () => {
    if (!shortCode) return;
    try {
      await Clipboard.setStringAsync(shortCode);
    } catch {
      // ignore
    }
  }, [shortCode]);

  useEffect(() => {
    if (isWaitingForOpponent && shortCode) {
      setShowCodeModal(true);
    } else if (opponentConnected) {
      setShowCodeModal(false);
    }
  }, [isWaitingForOpponent, opponentConnected, shortCode]);

  const screenProps: GameScreenProps = {
    player1,
    player2,
    phase,
    point,
    diceValues,
    isRolling,
    isProcessing: effectiveProcessing,
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
    isOnline: true,
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

  return {
    screenProps,
    isOnline,
    isCreator,
    showCodeModal,
    shortCode,
    handleCopyCode,
    handleGoHome,
  };
};
