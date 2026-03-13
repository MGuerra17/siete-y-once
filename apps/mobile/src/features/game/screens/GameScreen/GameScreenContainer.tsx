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
import * as Clipboard from "expo-clipboard";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";
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

  const { mode, showCode } = useLocalSearchParams<{
    mode?: GameMode;
    showCode?: string;
  }>();
  const isOnline = mode === GameMode.ONLINE;
  const router = useRouter();
  const { t } = useLanguage();
  const navigation = useNavigation();

  const localEngine = useLocalGameEngine();
  const onlineEngine = useOnlineGameEngine();
  const engine = isOnline ? onlineEngine : localEngine;

  const shortCode = useOnlineStore((s) => s.shortCode);
  const isCreator = useOnlineStore((s) => s.isCreator);
  const opponentConnected = useOnlineStore((s) => s.opponentConnected);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const isLocalPlayerActive = isOnline
    ? phase === GamePhase.INITIAL_ROLL
      ? activeInitialRollerId === "player1"
      : phase === GamePhase.BET_PLACEMENT || phase === GamePhase.POINT_PHASE
        ? bettorId === "player1"
        : (phase === GamePhase.SHOOTER_ROLLING ||
            phase === GamePhase.WAITING_FOR_ROLL) &&
          shooterId === "player1"
    : player1.isActive;

  const isWaitingForOpponent =
    isOnline && isCreator && !opponentConnected && showCode === "1";
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
    // Mientras esperamos al oponente no debe correr el contador ni disparar acciones por timeout.
    isProcessing: effectiveProcessing || isWaitingForOpponent,
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
    lastWinnerId,
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
    if (isWaitingForOpponent && shortCode) {
      setShowCodeModal(true);
    } else if (opponentConnected) {
      setShowCodeModal(false);
    }
  }, [isWaitingForOpponent, opponentConnected, shortCode]);

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

  const handleCopyCode = useCallback(async () => {
    if (!shortCode) return;
    try {
      await Clipboard.setStringAsync(shortCode);
    } catch {
      // ignore
    }
  }, [shortCode]);

  return (
    <>
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

      {isOnline && isCreator && showCodeModal && shortCode && (
        <Modal
          transparent
          animationType="fade"
          visible
          onRequestClose={() => {
            // Modal solo se cierra automáticamente cuando se conecta el oponente.
          }}
        >
          <View style={styles.codeModalBackdrop}>
            <View style={styles.codeModalCard}>
              <Text style={styles.codeModalTitle}>Código de partida</Text>
              <Text style={styles.codeModalCode}>{shortCode}</Text>

              <Pressable
                  style={styles.codeModalGhostButton}
                  onPress={handleCopyCode}
                >
                  <Ionicons
                    name="copy-outline"
                    size={16}
                    color={colors.textSecondary}
                    style={styles.codeModalGhostIcon}
                  />
                  <Text style={styles.codeModalGhostLabel}>Copiar código</Text>
                </Pressable>

                <View style={styles.codeModalActionsRow}>
                  <Pressable
                    style={[styles.codeModalActionButton, styles.codeModalExitButton]}
                    onPress={handleGoHome}
                  >
                    <Text
                      style={[
                        styles.codeModalActionLabel,
                        styles.codeModalExitLabel,
                      ]}
                    >
                      Salir
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.codeModalActionButton,
                      styles.codeModalPrimaryButton,
                    ]}
                    onPress={async () => {
                      try {
                        await Share.share({
                          message: `Únete a mi partida con este código: ${shortCode}`,
                        });
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    <Text style={styles.codeModalPrimaryLabel}>Compartir</Text>
                  </Pressable>
                </View>

            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  codeModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  codeModalCard: {
    width: "80%",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.xl,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    gap: spacing.md,
  },
  codeModalTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  codeModalCode: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    letterSpacing: 8,
    color: colors.primary,
  },
  codeModalGhostButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  codeModalGhostIcon: {
    opacity: 0.8,
  },
  codeModalGhostLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  codeModalActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  codeModalActionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  codeModalExitButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  codeModalPrimaryButton: {
    backgroundColor: colors.primary,
  },
  codeModalActionLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  codeModalExitLabel: {
    color: colors.textSecondary,
  },
  codeModalPrimaryLabel: {
    color: colors.background,
  },
});
