import type { RefObject } from "react";
import { Platform, Share, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import type { Player } from "@/src/features/game/types";
import type { TranslateFn } from "@/src/core/hooks/useLanguage";
import { getPlayerDisplayName } from "@/src/features/game/utils/playerDisplayName";

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
  const message = t("game.endModal.shareMessage", {
    winner: winnerName,
    loser: loserName,
    totalRounds,
  });
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
