import React from "react";
import { View } from "react-native";
import { BetBill } from "@/src/features/game/components/BetBill/BetBill";
import { PlayerInfo } from "@/src/features/game/components/PlayerInfo/PlayerInfo";
import type { GameBoardBottomProps } from "@/src/features/game/components/GameBoardBottom/GameBoardBottom.types";
import { styles } from "@/src/features/game/components/GameBoardBottom/GameBoardBottom.styles";

/** Bottom section of the game board: bet bill and local player info. */
export const GameBoardBottom: React.FC<GameBoardBottomProps> = ({
  player,
  isInitialPhase,
  currentBet,
  bettorId,
  keepBet,
  canUnlock,
  lastWinnerId,
  lastWinningNumber,
  onKeepBetChange,
  canToggleLock,
}) => {
  const isBettor = bettorId === player.id;

  return (
    <View style={styles.bottom}>
      <View style={styles.betBillContainer}>
        <BetBill
          amount={currentBet}
          centered
          visible={isBettor}
          keepBet={keepBet}
          onKeepBetToggle={() => onKeepBetChange(!keepBet)}
          showLockButton={canToggleLock && isBettor && currentBet > 0}
          lockPermanent={keepBet && !canUnlock}
        />
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
    </View>
  );
};

