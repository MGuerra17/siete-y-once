import React from "react";
import { Modal, Pressable, Share, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { colors } from "@/src/theme/colors";
import { styles } from "@/src/features/online/components/OnlineCodeModal/OnlineCodeModal.styles";

export type OnlineCodeModalProps = {
  visible: boolean;
  shortCode: string;
  copied: boolean;
  onCopy: () => void;
  onExit: () => void;
};

export const OnlineCodeModal: React.FC<OnlineCodeModalProps> = ({
  visible,
  shortCode,
  copied,
  onCopy,
  onExit,
}) => {
  const { t } = useLanguage();

  const handleShare = () => {
    const message = t("online.waiting.shareCodeMessage").replace(
      "{code}",
      shortCode,
    );
    Share.share({ message }).catch(() => {
      // User dismissed or share failed
    });
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible
      onRequestClose={() => {}}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {t("online.waiting.gameCodeTitle")}
          </Text>
          <Text style={styles.code}>{shortCode}</Text>

          <Pressable style={styles.ghostButton} onPress={onCopy}>
            <Ionicons
              name="copy-outline"
              size={16}
              color={colors.textSecondary}
              style={styles.ghostIcon}
            />
            <Text style={styles.ghostLabel}>
              {copied
                ? t("online.waiting.codeCopied")
                : t("online.waiting.copyCodeCta")}
            </Text>
          </Pressable>

          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.actionButton, styles.exitButton]}
              onPress={onExit}
            >
              <Text style={[styles.actionLabel, styles.exitLabel]}>
                {t("online.waiting.exitCta")}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handleShare}
            >
              <Text style={[styles.actionLabel, styles.primaryLabel]}>
                {t("online.waiting.shareCta")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
