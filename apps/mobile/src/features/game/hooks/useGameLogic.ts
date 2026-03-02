import { useCallback, useState } from "react";
import { PlayerRole } from "../enums/PlayerRole";
import type { GameState, Player } from "../types";

const getRandomDie = () => Math.floor(Math.random() * 6) + 1;

const INITIAL_MIN_BET = 50; // 50k

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
  currentBet: INITIAL_MIN_BET,
  minBet: INITIAL_MIN_BET,
  activeBetterId: "player1",
  isBetSheetVisible: false,
  point: 0,
  diceValues: [1, 1],
  isRolling: false,
});

const getActiveBetter = (state: GameState): Player | null => {
  const candidates: Player[] = [state.player1, state.player2];
  const better = candidates.find(
    (player) => player.currentRole === PlayerRole.BETTER && player.isActive,
  );

  return better ?? null;
};

export const useGameLogic = () => {
  const [state, setState] = useState<GameState>(createInitialState);

  const rollDice = useCallback(() => {
    // Prevent rolling if bet sheet is visible (bet not confirmed yet)
    if (state.isBetSheetVisible) {
      return;
    }

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
  }, [state.isBetSheetVisible]);

  const onDicePress = useCallback(() => {
    // Only allow rolling when the active role is ROLLER
    const rollerIsActive =
      (state.player1.currentRole === PlayerRole.ROLLER &&
        state.player1.isActive) ||
      (state.player2.currentRole === PlayerRole.ROLLER &&
        state.player2.isActive);

    if (!rollerIsActive || state.isRolling) {
      return;
    }

    rollDice();
  }, [rollDice, state]);

  const openBetSheet = useCallback(() => {
    setState((prev) => {
      const activeBetter = getActiveBetter(prev);

      if (!activeBetter) {
        return prev;
      }

      return {
        ...prev,
        activeBetterId: activeBetter.id,
        currentBet: prev.minBet,
        isBetSheetVisible: true,
      };
    });
  }, []);

  const submitBet = useCallback((bet: number) => {
    setState((prev) => ({
      ...prev,
      currentBet: bet,
      isBetSheetVisible: false,
    }));
  }, []);

  return {
    state,
    rollDice,
    onDicePress,
    openBetSheet,
    submitBet,
  };
};
