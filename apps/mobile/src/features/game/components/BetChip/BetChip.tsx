import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { AppText } from "@/src/core/components/AppText/AppText";
import { GlassSurface } from "@/src/core/components/GlassSurface/GlassSurface";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { formatMoney } from "@/src/core/utils/formatMoney";
import { colors } from "@/src/theme/colors";
import { radii } from "@/src/theme/spacing";

export type BetChipProps = {
  amount: number;
  locked: boolean;
  /** Whether the viewer may toggle the lock (the bettor, on their own device). */
  canToggle: boolean;
  /** The bet already covers the maximum, so it stays locked. */
  lockPermanent?: boolean;
  onToggleLock: () => void;
};

/** The bet on the table, with the "keep it all round" lock. */
export const BetChip: React.FC<BetChipProps> = ({ amount, locked, canToggle, lockPermanent, onToggleLock }) => {
  const { t, language } = useLanguage();
  const interactive = canToggle && !lockPermanent;

  return (
    <GlassSurface strong style={styles.chip}>
      <Pressable
        onPress={interactive ? onToggleLock : undefined}
        disabled={!interactive}
        hitSlop={12}
        accessibilityRole="switch"
        accessibilityLabel={t("game.a11y.keepBetToggle")}
        accessibilityState={{ checked: locked, disabled: !interactive }}
        style={styles.lock}
      >
        <Ionicons name={locked ? "lock-closed" : "lock-open-outline"} size={16} color={colors.sun} />
      </Pressable>
      <AppText variant="label" tone="soft">
        {t("game.betChip")}
      </AppText>
      <AppText variant="figure" tone="light">
        {formatMoney(amount, language)}
      </AppText>
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 16,
    borderRadius: radii.md,
  },
  lock: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
});
