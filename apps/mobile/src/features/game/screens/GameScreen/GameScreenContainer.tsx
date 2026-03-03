import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, View } from "react-native";
import { GamePhase } from "../../enums/GamePhase";
import { useLocalGameEngine } from "../../hooks/useLocalGameEngine";
import { useGameStore } from "../../store/gameStore";
import { shareGameResult } from "../../utils/shareGameResult";
import { GameScreen } from "./GameScreen";

export const GameScreenContainer: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const engine = useLocalGameEngine();
  const navigation = useNavigation();

  const phase = useGameStore((s) => s.phase);
  const player1 = useGameStore((s) => s.player1);
  const player2 = useGameStore((s) => s.player2);
  const point = useGameStore((s) => s.point);
  const diceValues = useGameStore((s) => s.diceValues);
  const isRolling = useGameStore((s) => s.isRolling);
  const isProcessing = useGameStore((s) => s.isProcessing);
  const initialRolls = useGameStore((s) => s.initialRolls);
  const currentBet = useGameStore((s) => s.currentBet);
  const minBet = useGameStore((s) => s.minBet);
  const bettorId = useGameStore((s) => s.bettorId);
  const keepBet = useGameStore((s) => s.keepBet);
  const isBetSheetVisible = useGameStore((s) => s.isBetSheetVisible);
  const setKeepBet = useGameStore((s) => s.setKeepBet);
  const toastMessage = useGameStore((s) => s.toastMessage);
  const totalRounds = useGameStore((s) => s.totalRounds);
  const lastWinnerId = useGameStore((s) => s.lastWinnerId);
  const lastWinningNumber = useGameStore((s) => s.lastWinningNumber);
  const resetGame = useGameStore((s) => s.resetGame);
  const setToastMessage = useGameStore((s) => s.setToastMessage);

  const [isExitConfirmVisible, setIsExitConfirmVisible] = useState(false);

  const activeBetter =
    bettorId === "player1" ? player1 : bettorId === "player2" ? player2 : null;
  const maxBet = activeBetter?.currentMoney ?? minBet;

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
    if (phase === GamePhase.INITIAL_ROLL) {
      setToastMessage(t("game.toast.rollToDetermineShooter"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isExitConfirmVisible) {
          setIsExitConfirmVisible(false);
        } else {
          setIsExitConfirmVisible(true);
        }
        return true;
      }
    );
    return () => subscription.remove();
  }, [isExitConfirmVisible]);

  useEffect(() => {
    if (currentBet > 0 && currentBet >= maxBet) {
      setKeepBet(true);
    }
  }, [currentBet, maxBet, setKeepBet]);

  const handleGoHome = () => {
    resetGame();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const captureRef = useRef<View>(null);
  const winner =
    player1.currentMoney >= player2.currentMoney ? player1 : player2;
  const loser = winner.id === "player1" ? player2 : player1;

  const handleShare = () => {
    shareGameResult(
      captureRef,
      winner,
      loser,
      totalRounds,
      t as (key: string) => string,
    );
  };

  const handleExitConfirm = () => {
    setIsExitConfirmVisible(false);
    handleGoHome();
  };

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
      onDicePress={engine.onDicePress}
      onOpenBetSheet={engine.onOpenBetSheet}
      onKeepBetChange={setKeepBet}
      onSubmitBet={engine.onBetSubmit}
      onDismissToast={() => setToastMessage(null)}
      onGoHome={handleGoHome}
      onShare={handleShare}
      captureRef={captureRef}
      isExitConfirmVisible={isExitConfirmVisible}
      onExitPress={() => setIsExitConfirmVisible(true)}
      onExitConfirm={handleExitConfirm}
      onExitCancel={() => setIsExitConfirmVisible(false)}
    />
  );
};
