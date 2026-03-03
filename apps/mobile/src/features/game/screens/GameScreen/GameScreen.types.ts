import type { GamePhase } from "../../enums/GamePhase";
import type { Player, PlayerId } from "../../types";

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
};
