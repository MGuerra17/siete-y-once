import React from "react";
import { View, Text, Pressable } from "react-native";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { styles } from "./ExitConfirmModal.styles";
import type { ExitConfirmModalProps } from "./ExitConfirmModal.types";

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const { t } = useLanguage();

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.backdrop} pointerEvents="box-none">
      <View style={styles.card}>
        <Text style={styles.title}>{t("game.exitModal.title")}</Text>
        <Text style={styles.message}>{t("game.exitModal.message")}</Text>
        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.cancelButton}
            onPress={onCancel}
            accessibilityLabel={t("game.exitModal.cancelCta")}
            accessibilityRole="button"
          >
            <Text style={styles.cancelButtonText}>
              {t("game.exitModal.cancelCta")}
            </Text>
          </Pressable>
          <Pressable
            style={styles.confirmButton}
            onPress={onConfirm}
            accessibilityLabel={t("game.exitModal.exitCta")}
            accessibilityRole="button"
          >
            <Text style={styles.confirmButtonText}>
              {t("game.exitModal.exitCta")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
