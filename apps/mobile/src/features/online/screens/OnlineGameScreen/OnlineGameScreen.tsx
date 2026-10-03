import React from "react";
import { View } from "react-native";
import { GameScreen } from "@/src/features/game/screens/GameScreen/GameScreen";
import { WaitingRoom } from "@/src/features/online/components/WaitingRoom/WaitingRoom";
import { useCopyCode } from "@/src/features/online/hooks/useCopyCode";
import { useOnlineGameScreen } from "@/src/features/online/hooks/useOnlineGameScreen";
import { colors } from "@/src/theme/colors";

export const OnlineGameScreen: React.FC = () => {
  const { screenProps, waitingCode, leave } = useOnlineGameScreen();
  const { copied, copy } = useCopyCode(waitingCode);

  if (waitingCode) {
    return <WaitingRoom shortCode={waitingCode} copied={copied} onCopy={copy} onLeave={leave} />;
  }
  if (!screenProps) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  return <GameScreen {...screenProps} />;
};
