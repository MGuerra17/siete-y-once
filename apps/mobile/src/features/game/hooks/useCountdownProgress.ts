import { useEffect, useState } from "react";
import { countdownProgress } from "@/src/features/game/model/countdown";
import { useTurnTimerStore } from "@/src/features/game/store/turnTimerStore";
import type { PlayerId } from "@/src/features/game/types";

const TICK_MS = 100;

/**
 * Countdown progress for a seat (or for whoever is acting when `seat` is omitted).
 * Returns null when there is no countdown for it.
 */
export const useCountdownProgress = (seat?: PlayerId): number | null => {
  const deadline = useTurnTimerStore((s) => s.deadline);
  const durationMs = useTurnTimerStore((s) => s.durationMs);
  const timerSeat = useTurnTimerStore((s) => s.seat);
  const isMine = deadline !== null && (seat === undefined || seat === timerSeat);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isMine) return;
    const interval = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(interval);
  }, [isMine, deadline]);

  if (!isMine || deadline === null) return null;
  return countdownProgress(deadline, durationMs, now);
};
