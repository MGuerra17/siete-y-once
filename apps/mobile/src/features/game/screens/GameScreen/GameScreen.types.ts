import type { Player } from "../../types";

export type GameScreenProps = {
  player1: Player;
  player2: Player;
  point: number;
  diceValues: [number, number];
  isRolling: boolean;
  onDicePress: () => void;
};

