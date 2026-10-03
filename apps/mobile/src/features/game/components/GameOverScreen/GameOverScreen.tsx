import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { RefObject } from "react";
import { illustrations } from "@/src/core/assets/illustrations";
import { AppText } from "@/src/core/components/AppText/AppText";
import { GlassButton } from "@/src/core/components/GlassButton/GlassButton";
import { GlassSurface } from "@/src/core/components/GlassSurface/GlassSurface";
import { PosterScreen } from "@/src/core/components/PosterScreen/PosterScreen";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { formatMoney, formatMoneyCompact } from "@/src/core/utils/formatMoney";
import { gameOverCopy } from "@/src/features/game/components/GameOverScreen/gameOverCopy";
import type { GameStats } from "@/src/features/game/model/gameStats";
import type { Player } from "@/src/features/game/types";
import type { GameEndReason } from "@seven/game-core";
import { MIN_TOUCH, radii } from "@/src/theme/spacing";

export type GameOverScreenProps = {
  isOnline: boolean;
  winner: Player;
  loser: Player;
  winnerName: string;
  loserName: string;
  totalRounds: number;
  endReason: GameEndReason | null;
  /** Stats keyed by seat (player1 = bottom / local player). */
  stats: GameStats;
  primaryLabel: string;
  onPrimary: () => void;
  onShare: () => void;
  onHome: () => void;
  captureRef?: RefObject<View | null>;
};

/** Poster end screen: fireworks over the fort for a win, a quiet night for a loss. */
export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  isOnline,
  winner,
  loser,
  winnerName,
  loserName,
  totalRounds,
  endReason,
  stats,
  primaryLabel,
  onPrimary,
  onShare,
  onHome,
  captureRef,
}) => {
  const { t, language } = useLanguage();
  const localWon = winner.id === "player1";
  const copy = gameOverCopy(
    { isOnline, localWon, winnerName, loserName, rounds: totalRounds, endReason },
    t,
  );
  const reportedSeat = isOnline ? "player1" : winner.id;

  const statItems = [
    { label: t("game.over.statRounds"), value: String(totalRounds) },
    { label: t("game.over.statWon"), value: String(stats.roundsWon[reportedSeat]) },
    { label: t("game.over.statBiggestBet"), value: `$${formatMoneyCompact(stats.biggestBet)}` },
  ];

  return (
    <View ref={captureRef} collapsable={false} style={StyleSheet.absoluteFill} testID={`game-over-${copy.variant}`}>
      <PosterScreen
        source={copy.variant === "win" ? illustrations.gameOverWin : illustrations.gameOverLose}
        fadeStart={0.62}
        eyebrow={copy.eyebrow}
        title={copy.showMoney ? formatMoney(winner.currentMoney, language) : (copy.title ?? undefined)}
        titleSize={copy.showMoney ? "hero" : "title"}
        subtitle={copy.subtitle}
      >
        <View style={styles.stats}>
          {statItems.map((item) => (
            <GlassSurface key={item.label} style={styles.stat} accessible accessibilityLabel={`${item.label}: ${item.value}`}>
              <AppText variant="heading" tone="strong">
                {item.value}
              </AppText>
              <AppText variant="caption" tone="soft">
                {item.label}
              </AppText>
            </GlassSurface>
          ))}
        </View>
        <PrimaryButton label={primaryLabel} onPress={onPrimary} />
        <GlassButton label={t("game.over.share")} icon="share-outline" onPress={onShare} />
        <Pressable onPress={onHome} accessibilityRole="button" style={styles.link} hitSlop={6}>
          <AppText variant="bodyStrong" tone="soft">
            {t("game.over.home")}
          </AppText>
        </Pressable>
      </PosterScreen>
    </View>
  );
};

const styles = StyleSheet.create({
  stats: { flexDirection: "row", gap: 10, marginBottom: 4 },
  stat: { flex: 1, gap: 2, paddingVertical: 12, paddingHorizontal: 14, borderRadius: radii.md },
  link: { minHeight: MIN_TOUCH, alignItems: "center", justifyContent: "center" },
});
