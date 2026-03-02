import React from "react";
import { useGameLogic } from "../../hooks/useGameLogic";
import { GameScreen } from "./GameScreen";

export const GameScreenContainer: React.FC = () => {
  const { state, onDicePress } = useGameLogic();

  return (
    <GameScreen
      player1={state.player1}
      player2={state.player2}
      point={state.point}
      diceValues={state.diceValues}
      isRolling={state.isRolling}
      onDicePress={onDicePress}
    />
  );
};
