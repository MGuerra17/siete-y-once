import type { Player } from "../../types";
import type { GameEndModalProps } from "../../components/GameEndModal/GameEndModal.types";
import type { GameToastProps } from "../../components/GameToast/GameToast.types";

export type GameScreenProps = {
  player1: Player;
  player2: Player;
  activeBetterId: Player["id"] | null;
  currentBet: number;
  minBet: number;
  point: number;
  diceValues: [number, number];
  isRolling: boolean;
  lastRollSumPlayer1?: number;
  lastRollSumPlayer2?: number;
  onDicePress: () => void;
  onOpenBetSheet: () => void;
  onSubmitBet: (bet: number) => void;
  isBetSheetVisible: boolean;
  endModalProps?: GameEndModalProps;
  toastProps?: GameToastProps;
};
