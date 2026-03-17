import { AppText } from "@/src/core/components/AppText/AppText";
import { Avatar } from "@/src/core/components/Avatar/Avatar";
import { formatMoneyCompact } from "@/src/core/utils/formatMoney";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { PlayerRole } from "@/src/features/game/enums/PlayerRole";
import { styles } from "@/src/features/game/components/PlayerInfo/PlayerInfo.styles";
import { PlayerInfoProps } from "@/src/features/game/components/PlayerInfo/PlayerInfo.types";

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
  id,
  name,
  imageUri,
  currentMoney,
  role,
  winningNumbers,
  isActive,
  activeWinningNumber = null,
  countdownProgress = null,
}) => {
  const variant = id === "player1" ? "primary" : "secondary";
  const { t } = useLanguage();

  const defaultName =
    id === "player1"
      ? t("game.player1DefaultName")
      : t("game.player2DefaultName");

  const displayName = name || defaultName;

  const roleLabel =
    role === PlayerRole.BETTER
      ? t("game.betRoleLabel")
      : t("game.rollRoleLabel");

  const formattedMoney = formatMoneyCompact(currentMoney);

  const a11yLabel = `${displayName}, ${roleLabel}, ${formattedMoney}`;

  return (
    <View
      style={[
        styles.container,
        variant === "secondary" && styles.containerSecondary,
      ]}
      accessibilityLabel={a11yLabel}
      accessibilityRole="summary"
    >
      <View style={styles.avatarColumn}>
        <Avatar
          imageUri={imageUri ?? undefined}
          isActive={isActive}
          fallbackLabel={displayName}
          countdownProgress={countdownProgress}
        />
      </View>
      <View
        style={[styles.info, variant === "secondary" && styles.infoSecondary]}
      >
        <View style={styles.moneyRow}>
          <View
            style={[
              styles.roleChip,
              isActive ? styles.roleChipActive : styles.roleChipInactive,
            ]}
          >
            <Text style={styles.roleChipText} numberOfLines={1}>
              {roleLabel}
            </Text>
          </View>
          <View style={styles.moneyChip}>
            <Ionicons
              name="cash-outline"
              size={16}
              color={colors.primary}
              style={styles.moneyIcon}
            />
            <Text style={styles.moneyText}>{formattedMoney}</Text>
          </View>
        </View>
        <View
          style={[
            styles.nameRow,
            variant === "secondary" && styles.nameRowSecondary,
          ]}
        >
          <View style={styles.nameTextWrap}>
            <AppText
              variant="subtitle"
              numberOfLines={1}
              ellipsizeMode="tail"
              align={variant === "secondary" ? "right" : "left"}
            >
              {displayName}
            </AppText>
          </View>
          <View style={styles.winningNumbersRow}>
            {winningNumbers.map((num) => (
              <View
                key={num}
                style={[
                  styles.winningNumberPill,
                  num === activeWinningNumber && styles.winningNumberPillActive,
                ]}
              >
                <Text style={styles.winningNumberText}>{num}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
