import { Ionicons } from "@expo/vector-icons";
import { BET_STEPS } from "@seven/game-core";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/core/components/AppText/AppText";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { SandSheet } from "@/src/core/components/SandSheet/SandSheet";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { formatMoney, formatMoneyCompact } from "@/src/core/utils/formatMoney";
import { haptics } from "@/src/core/utils/haptics";
import type { BetSheetProps } from "@/src/features/game/components/BetSheet/BetSheet.types";
import { CountdownRing } from "@/src/features/game/components/BetSheet/CountdownRing";
import { useBetControls } from "@/src/features/game/hooks/useBetControls";
import { colors } from "@/src/theme/colors";
import { radii } from "@/src/theme/spacing";

/** Sand bottom sheet where the bettor sets, keeps or raises the bet. */
export const BetSheet: React.FC<BetSheetProps> = ({
  visible,
  playerName,
  currentBet,
  minBet,
  maxBet,
  isFirstBet,
  point,
  betLocked,
  canToggleLock,
  onToggleLock,
  onSubmitBet,
}) => {
  const { t, language } = useLanguage();
  const bet = useBetControls({ minBet, maxBet, isFirstBet, currentBet });

  // Each time the sheet opens a new decision starts from the minimum or the current bet.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) bet.resetTo(isFirstBet ? minBet : currentBet);
  }

  const amount = formatMoney(bet.sheetBet, language);

  const submit = () => {
    if (!bet.isValidBet) return;
    haptics.tap();
    onSubmitBet(bet.sheetBet);
  };

  return (
    <SandSheet visible={visible} dismissible={false}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="heading" tone="dark" numberOfLines={1} accessibilityRole="header">
            {t("game.betSheet.title", { name: playerName })}
          </AppText>
          <AppText variant="caption" tone="darkMuted">
            {point === null
              ? t("game.betSheet.winsFirstRoll")
              : t("game.betSheet.winsOnPoint", { point })}
          </AppText>
        </View>
        <CountdownRing />
      </View>

      <View style={styles.amountRow}>
        <RoundButton
          icon="remove"
          label={t("game.betSheet.decrease")}
          onPress={bet.decrease}
          disabled={!bet.canDecrease}
        />
        <View style={styles.amount}>
          <AppText variant="title" tone="dark" adjustsFontSizeToFit numberOfLines={1} accessibilityLiveRegion="polite">
            {amount}
          </AppText>
          <AppText variant="caption" tone="darkMuted">
            {t("game.betSheet.maxLabel", { amount: formatMoney(maxBet, language) })}
          </AppText>
        </View>
        <RoundButton
          icon="add"
          label={t("game.betSheet.increase")}
          onPress={bet.increase}
          disabled={!bet.canIncrease}
          filled
        />
      </View>

      <View style={styles.steps} accessibilityRole="radiogroup">
        {BET_STEPS.map((step) => {
          const selected = step === bet.step;
          return (
            <Pressable
              key={step}
              onPress={() => {
                haptics.selection();
                bet.setStep(step);
              }}
              accessibilityRole="radio"
              accessibilityLabel={t("game.betSheet.step", { amount: formatMoney(step, language) })}
              accessibilityState={{ selected }}
              style={[styles.step, selected && styles.stepSelected]}
            >
              <AppText variant="bodyStrong" tone={selected ? "light" : "dark"}>
                {formatMoneyCompact(step)}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {canToggleLock && !isFirstBet && (
        <Pressable
          onPress={onToggleLock}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: betLocked }}
          style={styles.keepRow}
        >
          <View style={[styles.checkbox, betLocked && styles.checkboxOn]}>
            {betLocked && <Ionicons name="checkmark" size={16} color={colors.sand} />}
          </View>
          <View style={styles.keepText}>
            <AppText variant="bodyStrong" tone="dark">
              {t("game.betSheet.keepRound")}
            </AppText>
            <AppText variant="caption" tone="darkMuted">
              {t("game.betSheet.keepRoundHint")}
            </AppText>
          </View>
        </Pressable>
      )}

      <PrimaryButton label={t(bet.ctaKey, { amount })} onPress={submit} disabled={!bet.isValidBet} />
    </SandSheet>
  );
};

type RoundButtonProps = {
  icon: "add" | "remove";
  label: string;
  onPress: () => void;
  disabled: boolean;
  filled?: boolean;
};

const RoundButton: React.FC<RoundButtonProps> = ({ icon, label, onPress, disabled, filled }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled }}
    style={({ pressed }) => [
      styles.round,
      filled ? styles.roundFilled : styles.roundOutline,
      disabled && styles.disabled,
      pressed && styles.pressed,
    ]}
  >
    <Ionicons name={icon} size={24} color={filled ? colors.sand : colors.textOnSand} />
  </Pressable>
);

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerText: { flex: 1, gap: 2 },
  amountRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  amount: { flex: 1, alignItems: "center", gap: 2 },
  round: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  roundOutline: { borderWidth: 1.5, borderColor: "rgba(13,59,62,0.3)" },
  roundFilled: { backgroundColor: colors.background },
  steps: { flexDirection: "row", gap: 8 },
  step: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.sandBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  stepSelected: { backgroundColor: colors.background, borderColor: colors.background },
  keepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(13,59,62,0.07)",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.background },
  keepText: { flex: 1, gap: 2 },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.8 },
});
