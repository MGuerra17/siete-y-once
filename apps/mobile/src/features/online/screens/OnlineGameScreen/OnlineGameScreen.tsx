import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GameScreen } from "@/src/features/game/screens/GameScreen/GameScreen";
import { WaitingRoom } from "@/src/features/online/components/WaitingRoom/WaitingRoom";
import { useCopyCode } from "@/src/features/online/hooks/useCopyCode";
import { useOnlineGameScreen } from "@/src/features/online/hooks/useOnlineGameScreen";
import { useOnlineGameStore } from "@/src/features/online/store/onlineGameStore";
import { colors } from "@/src/theme/colors";

export const OnlineGameScreen: React.FC = () => {
  const { screenProps, waitingCode, leave } = useOnlineGameScreen();
  const { copied, copy } = useCopyCode(waitingCode);
  const hasSession = useOnlineGameStore((state) => state.session !== null);

  if (waitingCode) {
    return <WaitingRoom shortCode={waitingCode} copied={copied} onCopy={copy} onLeave={leave} />;
  }
  // Never leave the player on an empty screen: without a session there is nothing to show.
  if (!screenProps && !hasSession) return <Redirect href="/" />;
  if (!screenProps) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.sun} size="large" />
      </View>
    );
  }
  return <GameScreen {...screenProps} />;
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
