import { useSound } from "@/src/core/hooks/useSound";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useRef } from "react";

const diceRollSound = require("@/assets/audio/dice-roll.mp3");

/**
 * Plays the dice roll sound when isRolling transitions from false to true.
 * Respects the user's sound configuration (soundEnabled).
 */
export const useDiceRollSound = (isRolling: boolean) => {
  const { soundEnabled } = useSound();
  const player = useAudioPlayer(diceRollSound);
  const prevIsRolling = useRef(isRolling);

  useEffect(() => {
    const justStartedRolling = isRolling && !prevIsRolling.current;
    prevIsRolling.current = isRolling;

    if (justStartedRolling && soundEnabled) {
      player.seekTo(0);
      player.play();
    }
  }, [isRolling, soundEnabled, player]);
};
