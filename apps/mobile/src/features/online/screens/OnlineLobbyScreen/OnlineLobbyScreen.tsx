import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";
import { getWebSocketUrl } from "@/src/core/config/env";
import { wsService } from "@/src/features/online/services/WebSocketService";
import { useOnlineStore } from "@/src/features/online/store/onlineStore";
import {
  getUsername,
  setSession,
  setUsername as persistUsername,
} from "@/src/features/online/utils/storage";
import { UsernameBottomSheet } from "@/src/features/online/components/UsernameBottomSheet/UsernameBottomSheet";
import type {
  ServerGameStateMessage,
  ServerMessage,
} from "@/src/features/online/types/server";
import { mapServerStateToStore } from "@/src/features/online/utils/mapServerState";
import { useGameStore } from "@/src/features/game/store/gameStore";

export const OnlineLobbyScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState<string>("");
  const [joinCode, setJoinCode] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameSheetVisible, setUsernameSheetVisible] = useState(false);
  const activeUnsubscribeRef = useRef<(() => void) | null>(null);

  useFocusEffect(
    useCallback(() => {
      getUsername().then((name) => {
        if (name) setDisplayName(name);
      });
      setIsConnecting(false);
      setError(null);
      return () => {
        if (activeUnsubscribeRef.current) {
          activeUnsubscribeRef.current();
          activeUnsubscribeRef.current = null;
        }
      };
    }, []),
  );

  const connectAndSend = async (
    action: string,
    payload?: Record<string, unknown>,
  ) => {
    setIsConnecting(true);
    setError(null);
    try {
      const url = getWebSocketUrl();
      if (!url) {
        setError(t("online.error.connectionFailed"));
        setIsConnecting(false);
        return;
      }
      await wsService.connect(url, displayName);
      useOnlineStore.getState().setWsConnected(true);
      useOnlineStore.getState().setDisplayName(displayName);

      const unsubscribe = wsService.onMessage((data: ServerMessage) => {
        if (data.type === "error") {
          setError(data.message);
          setIsConnecting(false);
          wsService.disconnect();
          activeUnsubscribeRef.current = null;
          unsubscribe();
          return;
        }

        if (data.type === "gameState") {
          if (
            data.event === "gameCreated" &&
            data.gameId &&
            data.shortCode &&
            data.rejoinToken
          ) {
            useOnlineStore
              .getState()
              .setSession(
                data.gameId,
                data.shortCode,
                data.rejoinToken,
                "player1",
              );
            useOnlineStore.getState().setIsCreator(true);
            setSession({
              gameId: data.gameId,
              rejoinToken: data.rejoinToken,
              myPlayerSlot: "player1",
            });
            activeUnsubscribeRef.current = null;
            unsubscribe();
            router.push({
              pathname: "/online/waiting-room",
              params: { role: "creator" },
            });
          } else if (data.event === "joined" && data.game) {
            const msg = data as ServerGameStateMessage;
            if (msg.shortCode && msg.rejoinToken) {
              useOnlineStore
                .getState()
                .setSession(
                  msg.game.gameId,
                  msg.shortCode,
                  msg.rejoinToken,
                  "player2",
                );
              useOnlineStore.getState().setIsCreator(false);
              useOnlineStore.getState().setOpponentConnected(true);
              setSession({
                gameId: msg.game.gameId,
                rejoinToken: msg.rejoinToken,
                myPlayerSlot: "player2",
              });
              const storeUpdate = mapServerStateToStore(msg.game, "player2");
              useGameStore.setState({
                ...storeUpdate,
                isRolling: false,
                isProcessing: false,
                isBetSheetVisible: false,
                toastMessage: null,
              });
            }
            activeUnsubscribeRef.current = null;
            unsubscribe();
            setIsConnecting(false);
            router.replace({
              pathname: "/game",
              params: { mode: "online" },
            });
          }
        }
      });
      activeUnsubscribeRef.current = unsubscribe;

      wsService.send(action, payload);
    } catch {
      setError(t("online.error.connectionFailed"));
      setIsConnecting(false);
    }
  };

  const handleCreate = () => {
    useOnlineStore.getState().reset();
    connectAndSend("createGame");
  };

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length === 0) return;
    useOnlineStore.getState().reset();
    connectAndSend("joinGame", { shortCode: code });
  };

  const handleBack = () => {
    wsService.disconnect();
    useOnlineStore.getState().reset();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleEditUsername = () => {
    setUsernameSheetVisible(true);
  };

  const handleUsernameSubmit = async (name: string) => {
    await persistUsername(name);
    setDisplayName(name);
    setUsernameSheetVisible(false);
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>{t("online.lobby.title")}</Text>
          <View style={styles.backButton} />
        </View>

        <Pressable onPress={handleEditUsername} style={styles.usernameRow}>
          <Ionicons
            name="person-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={styles.usernameText}>{displayName}</Text>
          <Ionicons
            name="pencil-outline"
            size={14}
            color={colors.textSecondary}
          />
        </Pressable>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.section}>
          <PrimaryButton
            label={t("online.lobby.createGame")}
            onPress={handleCreate}
            disabled={isConnecting}
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t("online.lobby.enterCode")}</Text>
          <TextInput
            style={styles.codeInput}
            placeholder={t("online.lobby.codePlaceholder")}
            placeholderTextColor={colors.textSecondary}
            value={joinCode}
            onChangeText={(text) => setJoinCode(text.toUpperCase())}
            maxLength={6}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <PrimaryButton
            label={t("online.lobby.join")}
            onPress={handleJoin}
            disabled={isConnecting || joinCode.trim().length === 0}
          />
        </View>

        {isConnecting && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.loadingText}>
              {t("online.waiting.connecting")}
            </Text>
          </View>
        )}
      </View>

      <UsernameBottomSheet
        visible={usernameSheetVisible}
        onClose={() => setUsernameSheetVisible(false)}
        onSubmit={handleUsernameSubmit}
        initialValue={displayName}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  usernameText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: colors.danger + "20",
    borderRadius: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
  section: {
    gap: spacing.md,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  codeInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    letterSpacing: 8,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
