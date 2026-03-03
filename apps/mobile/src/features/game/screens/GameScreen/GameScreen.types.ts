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
  isBetSheetVisible: boolean;
  toastMessage: string | null;
  totalRounds: number;
  onDicePress: () => void;
  onOpenBetSheet: () => void;
  onSubmitBet: (amount: number) => void;
  onGoHome: () => void;
};
