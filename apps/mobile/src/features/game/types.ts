import { PlayerRole } from "@/src/features/game/enums/PlayerRole";

export type PlayerId = "player1" | "player2";

export type Player = {
  id: PlayerId;
  name?: string;
  imageUri?: string | null;
  currentMoney: number;
  currentRole: PlayerRole;
  winningNumbers: number[];
  isActive: boolean;
};
