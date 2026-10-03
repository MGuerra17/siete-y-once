import { ACTION_TIMEOUT_MS } from "@/src/features/game/constants/game.constants";
import { GamePhase } from "@/src/features/game/enums/GamePhase";
import { useCallback, useEffect, useRef, useState } from "react";

// Smaller interval for smoother updates than 100ms, without risking render loops.
const PROGRESS_UPDATE_INTERVAL_MS = 50;

function isWaitingForAction(
  phase: GamePhase,
  isBetSheetVisible: boolean,
  isProcessing: boolean,
  isRolling: boolean,
): boolean {
  if (isProcessing || isRolling) return false;
  if (phase === GamePhase.GAME_OVER) return false;
  if (phase === GamePhase.INITIAL_ROLL) return true;
  if (phase === GamePhase.BET_PLACEMENT && isBetSheetVisible) return true;
  if (phase === GamePhase.POINT_PHASE && isBetSheetVisible) return true;
  if (phase === GamePhase.SHOOTER_ROLLING) return true;
  if (phase === GamePhase.WAITING_FOR_ROLL) return true;
  return false;
}

export type UseActionTimerParams = {
  phase: GamePhase;
  isBetSheetVisible: boolean;
  isProcessing: boolean;
  isRolling: boolean;
  onExpire: () => void;
};

/**
 * Runs a countdown when the active player must act. Returns progress in [0, 1]
 * (0 = just started, 1 = time's up). Uses a short interval for reasonably smooth
 * updates while avoiding maximum update depth issues.
 */
export function useActionTimer({
  phase,
  isBetSheetVisible,
  isProcessing,
  isRolling,
  onExpire,
}: UseActionTimerParams): number | null {
  const [progress, setProgress] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const clearTimers = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(null);
  }, []);

  useEffect(() => {
    const waiting = isWaitingForAction(
      phase,
      isBetSheetVisible,
      isProcessing,
      isRolling,
    );

    if (!waiting) {
      clearTimers();
      return;
    }

    startTimeRef.current = Date.now();
    setProgress(0);

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setProgress(1);
      onExpireRef.current();
    }, ACTION_TIMEOUT_MS);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const next = Math.min(1, elapsed / ACTION_TIMEOUT_MS);
      setProgress((prev) => (prev === next ? prev : next));
    }, PROGRESS_UPDATE_INTERVAL_MS);

    return clearTimers;
  }, [
    phase,
    isBetSheetVisible,
    isProcessing,
    isRolling,
    clearTimers,
  ]);

  return progress;
}
