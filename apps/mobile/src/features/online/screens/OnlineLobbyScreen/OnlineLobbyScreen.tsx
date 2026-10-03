import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { AmbientBackground } from "@/src/core/components/AmbientBackground/AmbientBackground";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import { useBreakpoints } from "@/src/core/hooks/useBreakpoints";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useGoHome } from "@/src/features/game/hooks/useGameExit";
import { GameRulesCard } from "@/src/features/online/components/GameRulesCard/GameRulesCard";
import { JoinCodeBottomSheet } from "@/src/features/online/components/JoinCodeBottomSheet/JoinCodeBottomSheet";
import { JoinFooter } from "@/src/features/online/components/JoinFooter/JoinFooter";
import { LobbyHeader } from "@/src/features/online/components/LobbyHeader/LobbyHeader";
import { LobbyHero } from "@/src/features/online/components/LobbyHero/LobbyHero";
import { UsernameBottomSheet } from "@/src/features/online/components/UsernameBottomSheet/UsernameBottomSheet";
import { useOnlineLobby } from "@/src/features/online/hooks/useOnlineLobby";
import { styles } from "@/src/features/online/screens/OnlineLobbyScreen/OnlineLobbyScreen.styles";

export const OnlineLobbyScreen: React.FC = () => {
  const { t } = useLanguage();
  const goHome = useGoHome();
  const { isTablet, isLargeTablet } = useBreakpoints();
  const lobby = useOnlineLobby();
  const [isNameSheetVisible, setNameSheetVisible] = useState(false);
  const [isJoinSheetVisible, setJoinSheetVisible] = useState(false);

  const handleJoin = (code: string) => {
    setJoinSheetVisible(false);
    lobby.joinGame(code);
  };

  const handleNameSubmit = async (name: string) => {
    await lobby.changeName(name);
    setNameSheetVisible(false);
  };

  return (
    <ScreenContainer>
      <AmbientBackground />
      <View
        style={[
          styles.container,
          isTablet && styles.containerTablet,
          isLargeTablet && styles.containerLargeTablet,
        ]}
      >
        <LobbyHeader
          displayName={lobby.displayName}
          onBack={goHome}
          onEditName={() => setNameSheetVisible(true)}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LobbyHero />

          {lobby.error && (
            <View style={styles.errorContainer} accessibilityRole="alert">
              <Text style={styles.errorText}>{lobby.error}</Text>
            </View>
          )}

          <GameRulesCard />

          <View style={styles.actions}>
            <PrimaryButton
              label={t("online.lobby.createGame")}
              onPress={lobby.createGame}
              disabled={lobby.isConnecting}
              loading={lobby.isConnecting}
              style={[styles.createGameButton, ...(isTablet ? [styles.createGameButtonTablet] : [])]}
            />
          </View>
        </ScrollView>

        <JoinFooter disabled={lobby.isConnecting} onJoinPress={() => setJoinSheetVisible(true)} />
      </View>

      <UsernameBottomSheet
        visible={isNameSheetVisible}
        onClose={() => setNameSheetVisible(false)}
        onSubmit={handleNameSubmit}
        initialValue={lobby.displayName}
      />
      <JoinCodeBottomSheet
        visible={isJoinSheetVisible}
        onClose={() => setJoinSheetVisible(false)}
        onSubmit={handleJoin}
        loading={lobby.isConnecting}
        errorMessage={lobby.error}
      />
    </ScreenContainer>
  );
};
