import React from "react";
import { Pressable, Share, StyleSheet, View } from "react-native";
import { illustrations } from "@/src/core/assets/illustrations";
import { AppText } from "@/src/core/components/AppText/AppText";
import { IconButton } from "@/src/core/components/IconButton/IconButton";
import { PosterScreen } from "@/src/core/components/PosterScreen/PosterScreen";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { CodeTiles } from "@/src/features/online/components/CodeTiles/CodeTiles";
import { colors } from "@/src/theme/colors";
import { shadows } from "@/src/theme/shadows";
import { radii } from "@/src/theme/spacing";

export type WaitingRoomProps = {
  shortCode: string;
  copied: boolean;
  onCopy: () => void;
  onLeave: () => void;
};

/** Shown to the creator until the rival joins: the code to share, big and clear. */
export const WaitingRoom: React.FC<WaitingRoomProps> = ({ shortCode, copied, onCopy, onLeave }) => {
  const { t } = useLanguage();

  const handleInvite = () => {
    Share.share({ message: t("online.waiting.shareCodeMessage", { code: shortCode }) }).catch(
      () => undefined,
    );
  };

  return (
    <PosterScreen
      testID="waiting-room"
      source={illustrations.lobby}
      imageOffset={-120}
      fadeStart={0.39}
      eyebrow={t("online.lobby.eyebrow")}
      title={t("online.lobby.title")}
      titleSize="title"
      topLeft={
        <IconButton icon="chevron-back" accessibilityLabel={t("online.waiting.leave")} onPress={onLeave} />
      }
    >
      <View style={[styles.card, shadows.card]}>
        <View style={styles.header}>
          <AppText variant="heading" tone="dark">
            {t("online.waiting.title")}
          </AppText>
          <View style={styles.status} accessibilityLiveRegion="polite">
            <View style={styles.dot} />
            <AppText variant="label" tone="darkMuted">
              {t("online.waiting.status")}
            </AppText>
          </View>
        </View>
        <CodeTiles code={shortCode} />
        <View style={styles.actions}>
          <PrimaryButton
            label={t("online.waiting.invite")}
            icon="share-outline"
            onPress={handleInvite}
            style={styles.action}
          />
          <Pressable
            onPress={onCopy}
            accessibilityRole="button"
            style={({ pressed }) => [styles.copy, pressed && styles.pressed]}
          >
            <AppText variant="bodyStrong" tone="dark">
              {copied ? t("online.waiting.codeCopied") : t("online.waiting.copy")}
            </AppText>
          </Pressable>
        </View>
      </View>
    </PosterScreen>
  );
};

const styles = StyleSheet.create({
  card: { gap: 14, padding: 18, borderRadius: radii.xl, backgroundColor: colors.sand },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  status: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.online },
  actions: { flexDirection: "row", gap: 10 },
  action: { flex: 1, height: 52, borderRadius: radii.md },
  copy: {
    flex: 1,
    height: 52,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: "rgba(13,59,62,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.8 },
});
