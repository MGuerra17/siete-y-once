import { useEffect } from "react";
import { haptics } from "@/src/core/utils/haptics";
import type { GameEvent } from "@/src/features/game/types";

type Subscribe = (listener: (event: GameEvent) => void) => () => void;

/** Success / warning feedback when rounds and games are decided. */
export const useGameHaptics = (subscribe: Subscribe) => {
  useEffect(
    () =>
      subscribe((event) => {
        if (event.type === "roundWon" || event.type === "gameOver") {
          if (event.mine) haptics.success();
          else haptics.warning();
        }
      }),
    [subscribe],
  );
};
