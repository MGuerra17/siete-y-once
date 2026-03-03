import { useSound } from "@/src/core/hooks/useSound";
import { GameMode } from "@/src/features/game/enums/GameMode";
import { useAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useRef } from "react";

const betSound = require("@/assets/audio/bet.mp3");
const diceRollSound = require("@/assets/audio/dice-roll.mp3");
const winRoundSound = require("@/assets/audio/win-round.mp3");
const winGameSound = require("@/assets/audio/win-game.mp3");
const loseRoundSound = require("@/assets/audio/lose-round.mp3");
const loseGameSound = require("@/assets/audio/lose-game.mp3");

const playIfEnabled = (
  soundEnabled: boolean,
  player: ReturnType<typeof useAudioPlayer>,
) => {
  if (!soundEnabled) return;
  player.seekTo(0);
  player.play();
};

/**
 * Provides play functions for all game sounds.
 * Respects soundEnabled from user configuration.
 * lose-round and lose-game only play in online mode.
 * Plays dice roll sound automatically when isRolling transitions to true.
 */
export const useGameSounds = (
  gameMode: GameMode = GameMode.OFFLINE,
  isRolling?: boolean,
) => {
  const { soundEnabled } = useSound();
  const betPlayer = useAudioPlayer(betSound);
  const diceRollPlayer = useAudioPlayer(diceRollSound);
  const winRoundPlayer = useAudioPlayer(winRoundSound);
  const winGamePlayer = useAudioPlayer(winGameSound);
  const loseRoundPlayer = useAudioPlayer(loseRoundSound);
  const loseGamePlayer = useAudioPlayer(loseGameSound);

  const playBetSound = useCallback(() => {
    playIfEnabled(soundEnabled, betPlayer);
  }, [soundEnabled, betPlayer]);

  const playWinRoundSound = useCallback(() => {
    playIfEnabled(soundEnabled, winRoundPlayer);
  }, [soundEnabled, winRoundPlayer]);

  const playWinGameSound = useCallback(() => {
    playIfEnabled(soundEnabled, winGamePlayer);
  }, [soundEnabled, winGamePlayer]);

  const playLoseRoundSound = useCallback(() => {
    if (gameMode !== GameMode.ONLINE) return;
    playIfEnabled(soundEnabled, loseRoundPlayer);
  }, [gameMode, soundEnabled, loseRoundPlayer]);

  const playLoseGameSound = useCallback(() => {
    if (gameMode !== GameMode.ONLINE) return;
    playIfEnabled(soundEnabled, loseGamePlayer);
  }, [gameMode, soundEnabled, loseGamePlayer]);

  const playDiceRollSound = useCallback(() => {
    playIfEnabled(soundEnabled, diceRollPlayer);
  }, [soundEnabled, diceRollPlayer]);

  const prevIsRolling = useRef(isRolling ?? false);

  useEffect(() => {
    if (isRolling === undefined) return;
    const justStartedRolling = isRolling && !prevIsRolling.current;
    prevIsRolling.current = isRolling;
    if (justStartedRolling) {
      playDiceRollSound();
    }
  }, [isRolling, playDiceRollSound]);

  return {
    playBetSound,
    playDiceRollSound,
    playWinRoundSound,
    playWinGameSound,
    playLoseRoundSound,
    playLoseGameSound,
  };
};
