import type { RefObject } from "react";
import { Platform, Share, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import type { Player } from "@/src/features/game/types";
import { getPlayerDisplayName } from "@/src/features/game/utils/playerDisplayName";
import type { TranslateFn } from "@/src/features/game/utils/playerDisplayName";

/** Builds the localized share message by interpolating winner, loser, and rounds. */
function buildShareMessage(
  t: TranslateFn,
  winnerName: string,
  loserName: string,
  totalRounds: number,
): string {
  const template = t("game.endModal.shareMessage");
  return template
    .replace("{winner}", winnerName)
    .replace("{loser}", loserName)
    .replace("{totalRounds}", String(totalRounds));
}

/**
 * Captures a screenshot of the game-end view and opens the native share sheet.
 * Falls back to text-only sharing if the screenshot fails.
 */
export async function shareGameResult(
  viewRef: RefObject<View | null>,
  winner: Player,
  loser: Player,
  totalRounds: number,
  t: TranslateFn,
): Promise<void> {
  const winnerName = getPlayerDisplayName(winner, t);
  const loserName = getPlayerDisplayName(loser, t);
  const message = buildShareMessage(t, winnerName, loserName, totalRounds);
  const title = t("game.endModal.title");

  if (Platform.OS === "web") {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: message,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await navigator.clipboard?.writeText(message);
        }
      }
    } else {
      await navigator.clipboard?.writeText(message);
    }
    return;
  }

  try {
    let imageUri: string | undefined;

    if (viewRef.current) {
      try {
        imageUri = await captureRef(viewRef, {
          result: "tmpfile",
          format: "png",
          quality: 1,
        });
      } catch {
        // Fall through to text-only share
      }
    }

    const shareContent: { message: string; title?: string; url?: string } = {
      message,
      title,
    };

    if (imageUri) {
      shareContent.url = imageUri;
    }

    await Share.share(shareContent);
  } catch {
    // User dismissed or share failed - fail silently
  }
}
