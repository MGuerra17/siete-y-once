import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { BetBill } from "@/src/features/game/components/BetBill/BetBill";
import { PlayerInfo } from "@/src/features/game/components/PlayerInfo/PlayerInfo";
import type { GameBoardTopProps } from "@/src/features/game/components/GameBoardTop/GameBoardTop.types";
import { styles } from "@/src/features/game/components/GameBoardTop/GameBoardTop.styles";

/** Top section of the game board: exit button, opponent info, and bet bill. */
export const GameBoardTop: React.FC<GameBoardTopProps> = ({
  player,
  isInitialPhase,
  currentBet,
  bettorId,
  keepBet,
  canUnlock,
  lastWinnerId,
  lastWinningNumber,
  onExitPress,
  onKeepBetChange,
  canToggleLock,
}) => {
  const { t } = useLanguage();
  const isBettor = bettorId === player.id;
  const showLockButton = canToggleLock && isBettor && currentBet > 0;

  return (
    <View style={styles.top}>
      <View style={styles.topRow}>
        <Pressable
          style={styles.exitButton}
          onPress={onExitPress}
          accessibilityLabel={t("game.a11y.exitButton")}
          accessibilityRole="button"
        >
          <Ionicons name="exit-outline" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
      <PlayerInfo
        id={player.id}
        name={player.name}
        imageUri={player.imageUri}
        currentMoney={player.currentMoney}
        role={isInitialPhase ? null : player.currentRole}
        winningNumbers={player.winningNumbers}
        isActive={player.isActive}
        activeWinningNumber={lastWinnerId === player.id ? lastWinningNumber : null}
      />
      <View style={styles.betBillContainer}>
        <BetBill
          amount={currentBet}
          centered
          visible={isBettor}
          keepBet={keepBet}
          onKeepBetToggle={() => onKeepBetChange(!keepBet)}
          showLockButton={showLockButton}
          lockPermanent={keepBet && !canUnlock}
        />
      </View>
    </View>
  );
};

