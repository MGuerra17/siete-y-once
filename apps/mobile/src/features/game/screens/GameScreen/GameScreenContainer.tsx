import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useGameLogic } from "../../hooks/useGameLogic";
import { GameScreen } from "./GameScreen";

export const GameScreenContainer: React.FC = () => {
  const router = useRouter();
  const { state, onDicePress, openBetSheet, submitBet } = useGameLogic();
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalRounds] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { winner, loser } = useMemo(() => {
    if (!isGameOver) {
      return { winner: state.player1, loser: state.player2 };
    }

    const player1IsWinner =
      state.player1.currentMoney >= state.player2.currentMoney;

    return player1IsWinner
      ? { winner: state.player1, loser: state.player2 }
      : { winner: state.player2, loser: state.player1 };
  }, [isGameOver, state.player1, state.player2]);

  return (
    <GameScreen
      player1={state.player1}
      player2={state.player2}
      activeBetterId={state.activeBetterId}
      currentBet={state.currentBet}
      minBet={state.minBet}
      point={state.point}
      diceValues={state.diceValues}
      isRolling={state.isRolling}
      lastRollSumPlayer1={state.lastRollSumPlayer1}
      lastRollSumPlayer2={state.lastRollSumPlayer2}
      onDicePress={onDicePress}
      onOpenBetSheet={openBetSheet}
      onSubmitBet={submitBet}
      isBetSheetVisible={state.isBetSheetVisible}
      endModalProps={{
        visible: isGameOver,
        winner,
        loser,
        totalRounds,
        onGoHome: () => {
          setIsGameOver(false);
          router.replace("/");
        },
      }}
      toastProps={{
        message: toastMessage,
        onDismiss: () => setToastMessage(null),
      }}
    />
  );
};
