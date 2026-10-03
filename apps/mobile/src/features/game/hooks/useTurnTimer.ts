import { useEffect, useEffectEvent } from "react";
import { useTurnTimerStore } from "@/src/features/game/store/turnTimerStore";
import type { PlayerId } from "@/src/features/game/types";

type UseTurnTimerParams = {
  /** Local epoch ms when the turn expires, or null when no turn is running. */
  deadline: number | null;
  durationMs: number;
  seat: PlayerId | null;
  onExpire: () => void;
};

/** Publishes the countdown for the UI and calls `onExpire` once the deadline passes. */
export const useTurnTimer = ({ deadline, durationMs, seat, onExpire }: UseTurnTimerParams) => {
  const expire = useEffectEvent(onExpire);

  useEffect(() => {
    const { start, clear } = useTurnTimerStore.getState();
    if (deadline === null) {
      clear();
      return;
    }
    start(deadline, durationMs, seat);
    const timeout = setTimeout(() => expire(), Math.max(0, deadline - Date.now()));
    return () => {
      clearTimeout(timeout);
      clear();
    };
  }, [deadline, durationMs, seat]);
};
