import type { GameEndReason } from "@seven/game-core";
import type { TranslateFn } from "@/src/core/hooks/useLanguage";

export type GameOverVariant = "win" | "lose";

export type GameOverCopyInput = {
  isOnline: boolean;
  /** Online: whether the player holding this phone won. Ignored offline. */
  localWon: boolean;
  winnerName: string;
  loserName: string;
  rounds: number;
  endReason: GameEndReason | null;
};

export type GameOverCopy = {
  variant: GameOverVariant;
  eyebrow: string;
  /** Big figure (final money) on wins, a sentence on losses. */
  showMoney: boolean;
  title: string | null;
  subtitle: string;
};

export const roundsText = (rounds: number, t: TranslateFn) =>
  t(rounds === 1 ? "game.over.roundsOne" : "game.over.roundsOther", { count: rounds });

/** Headline texts for the end screen. Offline there is always a winner to celebrate. */
export function gameOverCopy(input: GameOverCopyInput, t: TranslateFn): GameOverCopy {
  const { isOnline, localWon, winnerName, loserName, endReason } = input;
  const rounds = roundsText(input.rounds, t);
  const forfeit = endReason === "FORFEIT";

  if (!isOnline) {
    return {
      variant: "win",
      eyebrow: t("game.over.playerWon", { name: winnerName }),
      showMoney: true,
      title: null,
      subtitle: forfeit
        ? t("game.over.subtitleOpponentLeft", { loser: loserName })
        : t("game.over.subtitleWon", { winner: winnerName, loser: loserName, rounds }),
    };
  }

  if (localWon) {
    return {
      variant: "win",
      eyebrow: t("game.over.youWon", { name: winnerName }),
      showMoney: true,
      title: null,
      subtitle: forfeit
        ? t("game.over.subtitleOpponentLeft", { loser: loserName })
        : t("game.over.subtitleYouWon", { loser: loserName, rounds }),
    };
  }

  return {
    variant: "lose",
    eyebrow: t("game.over.gameOver"),
    showMoney: false,
    title: t("game.over.tookTheTable", { name: winnerName }),
    subtitle: t("game.over.subtitleYouLost", { rounds }),
  };
}
