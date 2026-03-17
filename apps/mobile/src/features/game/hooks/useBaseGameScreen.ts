import { useEffect, useRef, useCallback } from "react";
import type { RefObject } from "react";
import type { View } from "react-native";

import { GamePhase } from "@/src/features/game/enums/GamePhase";
import type { Player, PlayerId } from "@/src/features/game/types";
import type { GameMode } from "@/src/features/game/enums/GameMode";
import { useGameSounds } from "@/src/features/game/hooks/useGameSounds";
import { shareGameResult } from "@/src/features/game/utils/shareGameResult";

export const getCurrentActionPlayerId = ({
  phase,
  activeInitialRollerId,
  bettorId,
  shooterId,
}: {
  phase: GamePhase;
  activeInitialRollerId: PlayerId | null;
  bettorId: PlayerId | null;
  shooterId: PlayerId | null;
}): PlayerId | null => {
  if (phase === GamePhase.INITIAL_ROLL) return activeInitialRollerId;
  if (phase === GamePhase.BET_PLACEMENT || phase === GamePhase.POINT_PHASE) {
    return bettorId;
  }
  if (phase === GamePhase.SHOOTER_ROLLING || phase === GamePhase.WAITING_FOR_ROLL) {
    return shooterId;
  }
  return null;
};

export const useAutoKeepBet = ({
  currentBet,
  maxBet,
  setKeepBet,
}: {
  currentBet: number;
  maxBet: number;
  setKeepBet: (value: boolean) => void;
}) => {
  useEffect(() => {
    if (currentBet > 0 && currentBet >= maxBet) {
      setKeepBet(true);
    }
  }, [currentBet, maxBet, setKeepBet]);
};

export const useGameWinEffects = ({
  mode,
  isRolling,
  phase,
  lastWinnerId,
}: {
  mode: GameMode;
  isRolling: boolean;
  phase: GamePhase;
  lastWinnerId: PlayerId | null;
}) => {
  const { playBetSound, playWinRoundSound, playWinGameSound } = useGameSounds(
    mode,
    isRolling,
  );

  useEffect(() => {
    if (lastWinnerId) playWinRoundSound();
  }, [lastWinnerId, playWinRoundSound]);

  const prevPhaseRef = useRef<GamePhase>(phase);

  useEffect(() => {
    const justEnteredGameOver =
      phase === GamePhase.GAME_OVER && prevPhaseRef.current !== GamePhase.GAME_OVER;
    prevPhaseRef.current = phase;
    if (justEnteredGameOver) playWinGameSound();
  }, [phase, playWinGameSound]);

  return { playBetSound };
};

export const useShareGameResultHandler = ({
  winner,
  loser,
  totalRounds,
  t,
}: {
  winner: Player | null;
  loser: Player | null;
  totalRounds: number;
  t: (key: string) => string;
}): {
  captureRef: RefObject<View | null>;
  handleShare: () => void;
} => {
  const captureRef = useRef<View | null>(null);

  const handleShare = useCallback(() => {
    if (winner == null || loser == null) return;
    shareGameResult(captureRef, winner, loser, totalRounds, t);
  }, [winner, loser, totalRounds, t]);

  return { captureRef, handleShare };
};

