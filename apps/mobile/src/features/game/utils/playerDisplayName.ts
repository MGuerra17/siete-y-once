import type { Player } from "@/src/features/game/types";

export type TranslateFn = (key: string) => string;

/** Minimal player shape needed for display name (id + optional name). */
export type PlayerDisplayNameInput = Pick<Player, "id"> & {
  name?: string | null;
};

/**
 * Returns the player's display name: their custom name if set,
 * otherwise the localized default ("Player 1" / "Player 2").
 */
export function getPlayerDisplayName(
  player: PlayerDisplayNameInput,
  t: TranslateFn,
): string {
  const defaultName =
    player.id === "player1"
      ? t("game.player1DefaultName")
      : t("game.player2DefaultName");
  return player.name ?? defaultName;
}
