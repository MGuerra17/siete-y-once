import { INITIAL_MONEY } from "@seven/game-core";
import React from "react";
import { Text, View } from "react-native";
import { useBreakpoints } from "@/src/core/hooks/useBreakpoints";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { formatMoneyCompact } from "@/src/core/utils/formatMoney";
import { styles } from "@/src/features/online/components/GameRulesCard/GameRulesCard.styles";

const PLAYER_COUNT = 2;

/** Summary of the online game settings (players and starting money). */
export const GameRulesCard: React.FC = () => {
  const { t } = useLanguage();
  const { isTablet, isLargeTablet } = useBreakpoints();
  return (
    <View
      style={[
        styles.configCard,
        isTablet && styles.configCardTablet,
        isLargeTablet && styles.configCardLargeTablet,
      ]}
    >
      <Text style={styles.configCardLabel}>{t("online.lobby.playerCount")}</Text>
      <View style={styles.configValue}>
        <Text style={styles.configValueNumber}>{PLAYER_COUNT}</Text>
      </View>
      <Text style={[styles.configCardLabel, styles.configCardLabelSecond]}>
        {t("online.lobby.betPerGame")}
      </Text>
      <View style={styles.configValue}>
        <Text style={styles.configValueNumber}>{formatMoneyCompact(INITIAL_MONEY)}</Text>
      </View>
    </View>
  );
};
