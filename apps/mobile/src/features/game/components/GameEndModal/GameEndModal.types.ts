import type { RefObject } from "react";
import type { View } from "react-native";
import type { Player } from "@/src/features/game/types";

export type GameEndModalProps = {
  visible: boolean;
  winner: Player;
  loser: Player;
  totalRounds: number;
  isOnline?: boolean;
  onGoHome: () => void;
  onShare?: () => void;
  captureRef?: RefObject<View | null>;
};

