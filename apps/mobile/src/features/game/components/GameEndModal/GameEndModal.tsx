import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { Avatar } from "@/src/core/components/Avatar/Avatar";
import { colors } from "@/src/theme/colors";
import { styles } from "./GameEndModal.styles";
import type { GameEndModalProps } from "./GameEndModal.types";

export const GameEndModal: React.FC<GameEndModalProps> = ({
  visible,
  winner,
  loser,
  totalRounds,
  onGoHome,
  onShare = () => {},
  captureRef,
}) => {
  const { t } = useLanguage();

  if (!visible) {
    return null;
  }

  const winnerDefaultName = winner.id === "player1"
    ? t("game.player1DefaultName")
    : t("game.player2DefaultName");

  const loserDefaultName = loser.id === "player1"
    ? t("game.player1DefaultName")
    : t("game.player2DefaultName");

  const winnerName = winner.name || winnerDefaultName;
  const loserName = loser.name || loserDefaultName;

  return (
    <View style={styles.backdrop} pointerEvents="box-none">
      <View ref={captureRef} style={styles.card} collapsable={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("game.endModal.title")}</Text>
          <Text style={styles.subtitle}>
            {t("game.endModal.subtitle")}
          </Text>
        </View>

        <View style={styles.avatarsRow}>
          <View style={styles.winnerAvatarWrapper}>
            <View>
              <Avatar
                imageUri={winner.imageUri ?? undefined}
                isActive
                size={104}
                fallbackLabel={winnerName}
              />
              <View style={styles.crownBadge}>
                <Ionicons name="trophy" size={18} color={colors.background} />
              </View>
            </View>
            <View style={styles.winnerLabelPill}>
              <Text style={styles.labelPillText}>
                {t("game.endModal.winnerLabel")}
              </Text>
            </View>
            <Text style={styles.playerName}>{winnerName}</Text>
          </View>

          <View style={styles.loserAvatarWrapper}>
            <Avatar
              imageUri={loser.imageUri ?? undefined}
              isActive={false}
              size={72}
              fallbackLabel={loserName}
            />
            <View style={styles.loserLabelPill}>
              <Text style={styles.labelPillText}>
                {t("game.endModal.loserLabel")}
              </Text>
            </View>
            <Text style={styles.playerName}>{loserName}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>
              {t("game.endModal.roundsLabel")}
            </Text>
            <Text style={styles.statValue}>{totalRounds}</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.secondaryButton}
            onPress={onShare}
            accessibilityLabel={t("game.endModal.shareCta")}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>
              {t("game.endModal.shareCta")}
            </Text>
          </Pressable>
          <Pressable
            style={styles.primaryButton}
            onPress={onGoHome}
            accessibilityLabel={t("game.endModal.goHomeCta")}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>
              {t("game.endModal.goHomeCta")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

