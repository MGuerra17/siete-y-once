import type { RefObject } from "react";
import type { View } from "react-native";
import type { GamePhase } from "@/src/features/game/enums/GamePhase";
import type { Player, PlayerId } from "@/src/features/game/types";

/** Props for the presentational GameScreen component, fully driven by the container. */
export type GameScreenProps = {
  player1: Player;
  player2: Player;
  phase: GamePhase;
  point: number | null;
  diceValues: [number, number];
  isRolling: boolean;
  isProcessing: boolean;
  initialRolls: Partial<Record<PlayerId, number>>;
  currentBet: number;
  minBet: number;
  bettorId: PlayerId | null;
  keepBet: boolean;
  isBetSheetVisible: boolean;
  toastMessage: string | null;
  totalRounds: number;
  lastWinnerId: PlayerId | null;
  lastWinningNumber: number | null;
  onDicePress: () => void;
  onOpenBetSheet: () => void;
  onKeepBetChange: (value: boolean) => void;
  onSubmitBet: (amount: number) => void;
  onDismissToast: () => void;
  onGoHome: () => void;
  onShare?: () => void;
  captureRef?: RefObject<View | null>;
  isExitConfirmVisible: boolean;
  onExitPress: () => void;
  onExitConfirm: () => void;
  onExitCancel: () => void;
};
