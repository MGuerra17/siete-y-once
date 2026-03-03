import { PlayerRole } from "@/src/features/game/enums/PlayerRole";

export type PlayerInfoVariant = "primary" | "secondary";

export type PlayerInfoProps = {
  id: "player1" | "player2";
  name?: string;
  imageUri?: string | null;
  currentMoney: number;
  role: PlayerRole;
  winningNumbers: number[];
  isActive: boolean;
  activeWinningNumber?: number | null;
  variant?: PlayerInfoVariant;
};

