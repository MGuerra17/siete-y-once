import { createInitialState, type GameState } from "@seven/game-core";
import { create } from "zustand";
import type { Flyer } from "@/src/features/game/types";

export type OfflineGameState = {
  core: GameState;
  isRolling: boolean;
  /** True while a roll is resolving or a result is on screen; blocks input and the timer. */
  isProcessing: boolean;
  isBetSheetVisible: boolean;
  toastMessage: string | null;
  flyer: Flyer | null;
  /** Local epoch ms when the current turn expires; null while nothing is expected. */
  turnDeadline: number | null;
};

export const createOfflineInitialState = (): OfflineGameState => ({
  core: createInitialState(),
  isRolling: false,
  isProcessing: false,
  isBetSheetVisible: false,
  toastMessage: null,
  flyer: null,
  turnDeadline: null,
});

export const useOfflineGameStore = create<OfflineGameState>(createOfflineInitialState);
