import React from "react";
import { View } from "react-native";
import { BetBill } from "@/src/features/game/components/BetBill/BetBill";
import { PlayerInfo } from "@/src/features/game/components/PlayerInfo/PlayerInfo";
import { PlayerRole } from "@/src/features/game/enums/PlayerRole";
import type { Player, PlayerId } from "@/src/features/game/types";
import { styles } from "@/src/features/game/screens/GameScreen/GameScreen.styles";

type GameBoardBottomProps = {
  player: Player;
  isInitialPhase: boolean;
  currentBet: number;
  bettorId: PlayerId | null;
  keepBet: boolean;
  canUnlock: boolean;
  lastWinnerId: PlayerId | null;
  lastWinningNumber: number | null;
  onKeepBetChange: (value: boolean) => void;
  countdownProgress?: number | null;
};

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
  countdownProgress = null,
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
          showLockButton={isBettor && currentBet > 0}
          lockPermanent={keepBet && !canUnlock}
        />
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
        countdownProgress={countdownProgress}
      />
    </View>
  );
};
