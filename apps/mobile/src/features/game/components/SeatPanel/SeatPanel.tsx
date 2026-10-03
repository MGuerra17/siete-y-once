import { PlayerRole } from "@seven/game-core";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/core/components/AppText/AppText";
import { Avatar } from "@/src/core/components/Avatar/Avatar";
import { GlassSurface } from "@/src/core/components/GlassSurface/GlassSurface";
import { useLanguage, type TranslateFn } from "@/src/core/hooks/useLanguage";
import { formatMoney } from "@/src/core/utils/formatMoney";
import { useCountdownProgress } from "@/src/features/game/hooks/useCountdownProgress";
import type { Player } from "@/src/features/game/types";
import { colors } from "@/src/theme/colors";
import { shadows } from "@/src/theme/shadows";
import { radii } from "@/src/theme/spacing";

export type SeatPanelProps = {
  player: Player;
  /** Name as shown, e.g. "Ana (tú)". */
  label: string;
  /** `sand` for the player holding the phone, `glass` for the rival. */
  variant: "sand" | "glass";
  isInitialPhase: boolean;
  /** Sum this seat rolled in the opening roll, if any. */
  initialRoll?: number;
};

/** [2, 3, 12] → "2, 3 o 12". */
const joinWithOr = (values: readonly number[], or: string): string =>
  values.length <= 1
    ? values.join("")
    : `${values.slice(0, -1).join(", ")} ${or} ${values[values.length - 1]}`;

/** "Apostador · gana con 7" or "Tirada inicial · Sacó 9". */
export function describeSeat(
  player: Pick<Player, "currentRole" | "winningNumbers">,
  isInitialPhase: boolean,
  initialRoll: number | undefined,
  t: TranslateFn,
): string {
  if (isInitialPhase || !player.currentRole) {
    const opening = t("game.role.opening");
    return initialRoll === undefined ? opening : `${opening} · ${t("game.openingRoll", { sum: initialRoll })}`;
  }
  const role = t(player.currentRole === PlayerRole.SHOOTER ? "game.role.shooter" : "game.role.bettor");
  const numbers = joinWithOr(player.winningNumbers, t("game.or"));
  return t("game.winsWith", { role, numbers });
}

/** A player's seat: avatar with turn ring, name, role and money. */
export const SeatPanel: React.FC<SeatPanelProps> = ({ player, label, variant, isInitialPhase, initialRoll }) => {
  const { t, language } = useLanguage();
  const countdown = useCountdownProgress(player.id);
  const isSand = variant === "sand";
  const description = describeSeat(player, isInitialPhase, initialRoll, t);
  const money = formatMoney(player.currentMoney, language);

  const content = (
    <>
      <Avatar
        name={label}
        background={isSand ? colors.coral : colors.sun}
        foreground={isSand ? colors.ivory : colors.textOnSand}
        ringColor={isSand ? colors.coral : colors.sun}
        isActive={player.isActive}
        countdownProgress={countdown}
      />
      <View style={styles.texts}>
        <AppText variant="bodyStrong" tone={isSand ? "dark" : "light"} numberOfLines={1}>
          {label}
        </AppText>
        <AppText variant="caption" tone={isSand ? "darkMuted" : "soft"} numberOfLines={1}>
          {description}
        </AppText>
      </View>
      <AppText variant="figure" tone={isSand ? "dark" : "light"}>
        {money}
      </AppText>
    </>
  );

  const a11y = {
    accessible: true,
    accessibilityLabel: `${label}. ${description}. ${money}`,
    accessibilityState: { selected: player.isActive },
  };

  return isSand ? (
    <View {...a11y} style={[styles.panel, styles.sand, shadows.card, !player.isActive && styles.idle]}>
      {content}
    </View>
  ) : (
    <GlassSurface {...a11y} strong style={[styles.panel, styles.glass, !player.isActive && styles.idle]}>
      {content}
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  panel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 16,
    borderRadius: radii.lg,
  },
  sand: { backgroundColor: colors.sand },
  glass: {},
  idle: { opacity: 0.86 },
  texts: { flex: 1, gap: 1 },
});
