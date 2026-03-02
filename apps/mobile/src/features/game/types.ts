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
  point: number;
  diceValues: [number, number];
  isRolling: boolean;
};

