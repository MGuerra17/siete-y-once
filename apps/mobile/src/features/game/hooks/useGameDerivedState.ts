import { useMemo } from "react";
import { getWinnerAndLoser } from "@/src/features/game/utils/gameUtils";
import type { Player, PlayerId } from "@/src/features/game/types";

type UseGameDerivedStateParams = {
  player1: Player;
  player2: Player;
  bettorId: PlayerId | null;
  currentBet: number;
  minBet: number;
};

/**
 * Derives common game values used by both the container and the UI.
 * Centralizes winner/loser, active better, max bet, and bet-related flags
 * so they are computed in a single place.
 */
export const useGameDerivedState = ({
  player1,
  player2,
  bettorId,
  currentBet,
  minBet,
}: UseGameDerivedStateParams) => {
  const activeBetter: Player | null =
    bettorId === "player1" ? player1 : bettorId === "player2" ? player2 : null;

  const maxBet = activeBetter?.currentMoney ?? minBet;
  const isFirstBet = currentBet === 0;
  const canUnlock = currentBet < maxBet;

  const { winner, loser } = useMemo(
    () => getWinnerAndLoser(player1, player2),
    [player1, player2],
  );

  return { activeBetter, maxBet, isFirstBet, canUnlock, winner, loser };
};
