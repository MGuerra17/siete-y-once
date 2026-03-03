import type { RefObject } from "react";
import type { View } from "react-native";
import type { Player } from "../../types";

export type GameEndModalProps = {
  visible: boolean;
  winner: Player;
  loser: Player;
  totalRounds: number;
  onGoHome: () => void;
  onShare?: () => void;
  captureRef?: RefObject<View | null>;
};

