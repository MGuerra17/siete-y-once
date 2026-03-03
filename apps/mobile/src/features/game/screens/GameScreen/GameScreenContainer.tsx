import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useLocalGameEngine } from "../../hooks/useLocalGameEngine";
import { useGameStore } from "../../store/gameStore";
import { GameScreen } from "./GameScreen";
import { GamePhase } from "../../enums/GamePhase";
import { useLanguage } from "@/src/core/hooks/useLanguage";

export const GameScreenContainer: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const engine = useLocalGameEngine();

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
  const isBetSheetVisible = useGameStore((s) => s.isBetSheetVisible);
  const toastMessage = useGameStore((s) => s.toastMessage);
  const totalRounds = useGameStore((s) => s.totalRounds);
  const resetGame = useGameStore((s) => s.resetGame);
  const setToastMessage = useGameStore((s) => s.setToastMessage);
  const setActiveInitialRoller = useGameStore((s) => s.setActiveInitialRoller);

  useEffect(() => {
    if (phase === GamePhase.INITIAL_ROLL) {
      setActiveInitialRoller("player1");
      setToastMessage(t("game.toast.rollToDetermineShooter"));
    }
  }, []);

  const handleGoHome = () => {
    resetGame();
    router.replace("/");
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
      isBetSheetVisible={isBetSheetVisible}
      toastMessage={toastMessage}
      totalRounds={totalRounds}
      onDicePress={engine.onDicePress}
      onOpenBetSheet={engine.onOpenBetSheet}
      onSubmitBet={engine.onBetSubmit}
      onGoHome={handleGoHome}
    />
  );
};
