import type { Player, PlayerId } from "@/src/features/game/types";

export type GameBoardMiddleProps = {
  player1: Player;
  player2: Player;
  isInitialPhase: boolean;
  point: number | null;
  diceValues: [number, number];
  isRolling: boolean;
  isInteractionBlocked: boolean;
  initialRolls: Partial<Record<PlayerId, number>>;
  onDicePress: () => void;
};

