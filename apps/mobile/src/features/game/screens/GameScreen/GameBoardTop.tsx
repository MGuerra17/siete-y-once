import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { BetBill } from "@/src/features/game/components/BetBill/BetBill";
import { PlayerInfo } from "@/src/features/game/components/PlayerInfo/PlayerInfo";
import { PlayerRole } from "@/src/features/game/enums/PlayerRole";
import type { Player, PlayerId } from "@/src/features/game/types";
import { styles } from "@/src/features/game/screens/GameScreen/GameScreen.styles";

type GameBoardTopProps = {
  player: Player;
  isInitialPhase: boolean;
  currentBet: number;
  bettorId: PlayerId | null;
  keepBet: boolean;
  canUnlock: boolean;
  lastWinnerId: PlayerId | null;
  lastWinningNumber: number | null;
  onExitPress: () => void;
  onKeepBetChange: (value: boolean) => void;
};

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
}) => {
  const { t } = useLanguage();
  const isBettor = bettorId === player.id;

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
        role={isInitialPhase ? PlayerRole.ROLLER : player.currentRole}
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
          showLockButton={isBettor && currentBet > 0}
          lockPermanent={keepBet && !canUnlock}
        />
      </View>
    </View>
  );
};
