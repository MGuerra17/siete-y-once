import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassSurface } from "@/src/core/components/GlassSurface/GlassSurface";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { haptics } from "@/src/core/utils/haptics";
import { useCountdownProgress } from "@/src/features/game/hooks/useCountdownProgress";
import { useTurnTimerStore } from "@/src/features/game/store/turnTimerStore";
import { colors } from "@/src/theme/colors";
import { radii } from "@/src/theme/spacing";
import { fonts } from "@/src/theme/typography";

export type RollButtonProps = {
  enabled: boolean;
  onPress: () => void;
  /** What to show when it is somebody else's move, e.g. "Turno de Beto". */
  waitingLabel: string | null;
};

/**
 * "Lanzar dados" with the turn countdown drawn inside it. It is the only part of the
 * screen subscribed to the timer tick besides the avatars.
 */
export const RollButton: React.FC<RollButtonProps> = ({ enabled, onPress, waitingLabel }) => {
  const { t } = useLanguage();
  const progress = useCountdownProgress();
  const durationMs = useTurnTimerStore((s) => s.durationMs);

  if (!enabled && waitingLabel) {
    return (
      <GlassSurface strong style={styles.waiting} accessible accessibilityRole="text">
        <Text style={styles.waitingText} numberOfLines={1}>
          {waitingLabel}
        </Text>
      </GlassSurface>
    );
  }

  const seconds = progress === null ? null : Math.ceil(((1 - progress) * durationMs) / 1000);
  const handlePress = () => {
    haptics.tap();
    onPress();
  };

  return (
    <PrimaryButton
      label={t("game.rollCta")}
      onPress={handlePress}
      disabled={!enabled}
      accessibilityHint={seconds === null ? undefined : t("game.a11y.secondsLeft", { seconds })}
      accessory={
        seconds === null ? null : (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{seconds} s</Text>
          </View>
        )
      }
    >
      {progress !== null && (
        <View
          pointerEvents="none"
          style={[styles.fill, { width: `${Math.max(0, (1 - progress) * 100)}%` }]}
        />
      )}
    </PrimaryButton>
  );
};

const styles = StyleSheet.create({
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 248, 234, 0.16)",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.pill,
    backgroundColor: "rgba(13, 59, 62, 0.28)",
  },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.textOnCoral },
  waiting: {
    height: 60,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  waitingText: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.textSecondary },
});
