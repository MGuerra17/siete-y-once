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
  /** In online mode, player1 is local; lock bet is only shown for the local player. */
  isOnline?: boolean;
  /** When true, dice can be rolled (phase is roll and local player is shooter). When false/undefined, dice stay blocked. */
  isDiceEnabled?: boolean;
  /** 0 = full ring, 1 = ring gone. Passed to the active player's avatar. */
  actionCountdownProgress: number | null;
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
