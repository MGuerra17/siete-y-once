import { useCallback, useState } from "react";
import { PlayerRole } from "../enums/PlayerRole";
import type { GameState } from "../types";

const getRandomDie = () => Math.floor(Math.random() * 6) + 1;

const createInitialState = (): GameState => ({
  player1: {
    id: "player1",
    name: undefined,
    imageUri: null,
    currentMoney: 1000,
    currentRole: PlayerRole.BETTER,
    winningNumbers: [7, 11],
    isActive: true,
  },
  player2: {
    id: "player2",
    name: undefined,
    imageUri: null,
    currentMoney: 1000,
    currentRole: PlayerRole.ROLLER,
    winningNumbers: [7, 11],
    isActive: false,
  },
  point: 0,
  diceValues: [1, 1],
  isRolling: false,
});

export const useGameLogic = () => {
  const [state, setState] = useState<GameState>(createInitialState);

  const rollDice = useCallback(() => {
    setState((prev) => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      const die1 = getRandomDie();
      const die2 = getRandomDie();
      const point = die1 + die2;

      setState((prev) => {
        const nextIsPlayer1Active = !prev.player1.isActive;
        return {
          ...prev,
          isRolling: false,
          diceValues: [die1, die2],
          point,
          player1: { ...prev.player1, isActive: nextIsPlayer1Active },
          player2: { ...prev.player2, isActive: !nextIsPlayer1Active },
        };
      });
    }, 500);
  }, []);

  const onDicePress = useCallback(() => {
    // Only allow rolling when the active role is ROLLER
    const rollerIsActive =
      (state.player1.currentRole === PlayerRole.ROLLER && state.player1.isActive) ||
      (state.player2.currentRole === PlayerRole.ROLLER && state.player2.isActive);

    if (!rollerIsActive || state.isRolling) {
      return;
    }

    rollDice();
  }, [rollDice, state]);

  return {
    state,
    rollDice,
    onDicePress,
  };
};

