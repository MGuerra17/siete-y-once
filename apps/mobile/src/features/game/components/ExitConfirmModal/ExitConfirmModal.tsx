import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/core/components/AppText/AppText";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import type { ExitConfirmModalProps } from "@/src/features/game/components/ExitConfirmModal/ExitConfirmModal.types";
import { colors } from "@/src/theme/colors";
import { shadows } from "@/src/theme/shadows";
import { MAX_CONTENT_WIDTH, radii } from "@/src/theme/spacing";

/** "Leave the game?" — online it also warns that leaving hands the win to the rival. */
export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({ visible, isOnline, onConfirm, onCancel }) => {
  const { t } = useLanguage();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={[styles.card, shadows.card]} accessibilityViewIsModal>
          <AppText variant="heading" tone="dark" accessibilityRole="header">
            {t("game.exitModal.title")}
          </AppText>
          <AppText variant="body" tone="darkMuted">
            {t(isOnline ? "game.exitModal.messageOnline" : "game.exitModal.message")}
          </AppText>
          <PrimaryButton label={t("game.exitModal.cancelCta")} onPress={onCancel} style={styles.primary} />
          <Pressable
            onPress={onConfirm}
            accessibilityRole="button"
            style={({ pressed }) => [styles.leave, pressed && styles.pressed]}
          >
            <AppText variant="bodyStrong" tone="dark">
              {t("game.exitModal.exitCta")}
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH - 60,
    gap: 10,
    padding: 22,
    borderRadius: radii.xl,
    backgroundColor: colors.sand,
  },
  primary: { marginTop: 8 },
  leave: {
    height: 52,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: "rgba(13,59,62,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.8 },
});
