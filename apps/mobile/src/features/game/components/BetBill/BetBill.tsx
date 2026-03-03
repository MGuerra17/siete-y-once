import { useLanguage } from "@/src/core/hooks/useLanguage";
import { formatMoneyCompact } from "@/src/core/utils/formatMoney";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./BetBill.styles";
import type { BetBillProps } from "./BetBill.types";

export const BetBill: React.FC<BetBillProps> = ({
  visible = false,
  amount,
  side = "left",
  centered = false,
  keepBet = false,
  onKeepBetToggle,
  showLockButton = false,
  lockPermanent = false,
}) => {
  const { t } = useLanguage();
  const formattedAmount = formatMoneyCompact(amount);

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        side === "right" && !centered && styles.containerRight,
        centered && styles.containerCentered,
      ]}
    >
      <View style={[styles.bill]}>
        {showLockButton && onKeepBetToggle && (
          <Pressable
            style={[styles.lockButton, lockPermanent && styles.lockButtonPermanent]}
            onPress={lockPermanent ? undefined : onKeepBetToggle}
            hitSlop={8}
          >
            <Ionicons
              name={keepBet ? "lock-closed" : "lock-open"}
              size={16}
              color={keepBet ? colors.primary : colors.textSecondary}
            />
          </Pressable>
        )}
        <View style={styles.billHeader}>
          <Ionicons name="cash" size={20} color="#15803d" style={styles.icon} />
          <Text style={styles.label}>{t("game.betSheet.currentBetLabel")}</Text>
        </View>
        <Text style={styles.amount}>{formattedAmount}</Text>
      </View>
    </View>
  );
};
