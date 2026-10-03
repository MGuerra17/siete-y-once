import type { TranslateFn } from "@/src/core/hooks/useLanguage";
import type { Player } from "@/src/features/game/types";

/** The player's chosen name, or the localized "Player 1" / "Player 2" for their seat. */
export function getPlayerDisplayName(player: Pick<Player, "id" | "name">, t: TranslateFn): string {
  if (player.name) return player.name;
  return t(player.id === "player1" ? "game.player1DefaultName" : "game.player2DefaultName");
}
