import type { RefObject } from "react";
import type { View } from "react-native";
import type { BoardView } from "@/src/features/game/model/boardView";
import type { Flyer, GameMode } from "@/src/features/game/types";

/** Props for the presentational GameScreen, shared by offline and online modes. */
export type GameScreenProps = {
  board: BoardView;
  mode: GameMode;
  isRolling: boolean;
  /** True when the local player may roll right now. */
  isDiceEnabled: boolean;
  isBetSheetVisible: boolean;
  toastMessage: string | null;
  /** Persistent online status (reconnecting, opponent away). */
  statusMessage?: string | null;
  flyer: Flyer | null;
  /** Seats allowed to toggle the bet lock (online: only the local, bottom seat). */
  lockableSeats: { top: boolean; bottom: boolean };
  onDicePress: () => void;
  onSubmitBet: (amount: number) => void;
  onToggleBetLock: () => void;
  onDismissToast: () => void;
  onGoHome: () => void;
  onShare: () => void;
  captureRef: RefObject<View | null>;
  exit: {
    visible: boolean;
    onPress: () => void;
    onConfirm: () => void;
    onCancel: () => void;
  };
};
