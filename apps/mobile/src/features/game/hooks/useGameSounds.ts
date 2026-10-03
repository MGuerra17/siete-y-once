import { useAudioPlayer, type AudioPlayer } from "expo-audio";
import { useEffect, useEffectEvent } from "react";
import { useSound } from "@/src/core/hooks/useSound";
import type { GameEvent } from "@/src/features/game/types";

const sources = {
  bet: require("@/assets/audio/bet.mp3"),
  roll: require("@/assets/audio/dice-roll.mp3"),
  winRound: require("@/assets/audio/win-round.mp3"),
  loseRound: require("@/assets/audio/lose-round.mp3"),
  winGame: require("@/assets/audio/win-game.mp3"),
  loseGame: require("@/assets/audio/lose-game.mp3"),
};

const replay = (player: AudioPlayer) => {
  player.seekTo(0);
  player.play();
};

type Subscribe = (listener: (event: GameEvent) => void) => () => void;

/** Plays the sound effect for each game event, honoring the user's sound setting. */
export const useGameSounds = (subscribe: Subscribe) => {
  const { soundEnabled } = useSound();
  const bet = useAudioPlayer(sources.bet);
  const roll = useAudioPlayer(sources.roll);
  const winRound = useAudioPlayer(sources.winRound);
  const loseRound = useAudioPlayer(sources.loseRound);
  const winGame = useAudioPlayer(sources.winGame);
  const loseGame = useAudioPlayer(sources.loseGame);

  const play = useEffectEvent((event: GameEvent) => {
    if (!soundEnabled) return;
    switch (event.type) {
      case "roll":
        return replay(roll);
      case "bet":
        return replay(bet);
      case "roundWon":
        return replay(event.mine ? winRound : loseRound);
      case "gameOver":
        return replay(event.mine ? winGame : loseGame);
    }
  });

  useEffect(() => subscribe((event) => play(event)), [subscribe]);
};
