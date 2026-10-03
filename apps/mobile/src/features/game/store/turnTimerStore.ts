import { create } from "zustand";
import type { PlayerId } from "@/src/features/game/types";

type TurnTimerState = {
  /** Local epoch ms when the turn expires; null when no turn is running. */
  deadline: number | null;
  durationMs: number;
  /** Seat whose avatar shows the countdown ring. */
  seat: PlayerId | null;
  start: (deadline: number, durationMs: number, seat: PlayerId | null) => void;
  clear: () => void;
};

/**
 * Shared turn countdown. Only the leaf components that draw it subscribe, so the
 * game screen does not re-render on every tick.
 */
export const useTurnTimerStore = create<TurnTimerState>((set) => ({
  deadline: null,
  durationMs: 1,
  seat: null,
  start: (deadline, durationMs, seat) => set({ deadline, durationMs, seat }),
  clear: () => set({ deadline: null, seat: null }),
}));
