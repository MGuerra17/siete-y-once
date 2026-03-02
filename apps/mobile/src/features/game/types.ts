import { PlayerRole } from "./enums/PlayerRole";

export type Player = {
  id: "player1" | "player2";
  name?: string;
  imageUri?: string | null;
  currentMoney: number;
  currentRole: PlayerRole;
  winningNumbers: number[];
  isActive: boolean;
};

export type GameState = {
  player1: Player;
  player2: Player;
  /**
   * Current bet amount for the active better.
   * Represented in thousands so 50 means 50k.
   */
  currentBet: number;
  /**
   * Minimum bet allowed for the current round.
   * Represented in thousands so 50 means 50k.
   */
  minBet: number;
  /**
   * Id of the player that is currently betting.
   */
  activeBetterId: Player["id"] | null;
  /**
   * Controls visibility of the betting bottom sheet.
   */
  isBetSheetVisible: boolean;
  point: number;
  diceValues: [number, number];
  isRolling: boolean;
  /** Sum of last dice roll by player 1 (when they were the roller). */
  lastRollSumPlayer1?: number;
  /** Sum of last dice roll by player 2 (when they were the roller). */
  lastRollSumPlayer2?: number;
};

