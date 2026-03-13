import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { JoinCodeBottomSheet } from "@/src/features/online/components/JoinCodeBottomSheet/JoinCodeBottomSheet";
import type {
  ServerGameStateMessage,
  ServerMessage,
} from "@/src/features/online/types/server";
import { mapServerStateToStore } from "@/src/features/online/utils/mapServerState";
import { useGameStore } from "@/src/features/game/store/gameStore";
import { INITIAL_MONEY } from "@/src/features/game/constants/game.constants";
import { formatMoneyCompact } from "@/src/core/utils/formatMoney";

export const OnlineLobbyScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameSheetVisible, setUsernameSheetVisible] = useState(false);
  const [joinCodeModalVisible, setJoinCodeModalVisible] = useState(false);
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
          } else if (data.event === "joined") {
            const msg = data as ServerGameStateMessage;
            if (msg.game && msg.shortCode && msg.rejoinToken) {
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

  const handleJoin = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length === 0) return;
    setJoinCodeModalVisible(false);
    useOnlineStore.getState().reset();
    connectAndSend("joinGame", { shortCode: trimmed });
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
      {Platform.OS !== "android" && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <View style={styles.backgroundLayer}>
            <View style={[styles.backgroundCircle, styles.backgroundCircle1]} />
            <View style={[styles.backgroundCircle, styles.backgroundCircle2]} />
            <View style={[styles.backgroundCircle, styles.backgroundCircle3]} />
            <View style={[styles.backgroundCircle, styles.backgroundCircle4]} />
          </View>
          <BlurView
            intensity={100}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            pointerEvents="none"
            style={styles.blurLayer}
          />
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Pressable
            onPress={handleEditUsername}
            style={({ pressed }) => [
              styles.usernameButton,
              pressed && styles.usernameButtonPressed,
            ]}
          >
            <Text style={styles.usernameButtonText}>{displayName}</Text>
            <Ionicons
              name="pencil-outline"
              size={14}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroImageContainer}>
            <Image
              source={require("@/assets/images/online-main.png")}
              style={styles.heroImage}
              contentFit="contain"
            />
          </View>

          <Text style={styles.heroTitle}>{t("online.lobby.heroTitle")}</Text>
          <Text style={styles.heroSubtitle}>
            {t("online.lobby.heroSubtitle")}
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.configCard}>
            <Text style={styles.configCardLabel}>
              {t("online.lobby.playerCount")}
            </Text>
            <View style={styles.configValue}>
              <Text style={styles.configValueNumber}>2</Text>
            </View>

            <Text
              style={[styles.configCardLabel, styles.configCardLabelSecond]}
            >
              {t("online.lobby.betPerGame")}
            </Text>
            <View style={styles.configValue}>
              <Text style={styles.configValueNumber}>
                {formatMoneyCompact(INITIAL_MONEY)}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label={t("online.lobby.createGame")}
              onPress={handleCreate}
              disabled={isConnecting}
              style={styles.createGameButton}
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
        </ScrollView>

        <View
          style={[
            styles.footerJoin,
            { paddingBottom: insets.bottom + spacing.lg },
          ]}
        >
          <Text style={styles.haveCodeText}>
            {t("online.lobby.haveCodeQuestion")}
          </Text>
          <Pressable
            onPress={() => setJoinCodeModalVisible(true)}
            disabled={isConnecting}
            style={({ pressed }) => [
              styles.joinCtaButton,
              pressed && !isConnecting && styles.joinCtaButtonPressed,
              isConnecting && styles.joinCtaButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.joinCtaLabel,
                isConnecting && styles.joinCtaLabelDisabled,
              ]}
            >
              {t("online.lobby.joinCta")}
            </Text>
          </Pressable>
        </View>
      </View>

      <UsernameBottomSheet
        visible={usernameSheetVisible}
        onClose={() => setUsernameSheetVisible(false)}
        onSubmit={handleUsernameSubmit}
        initialValue={displayName}
      />
      <JoinCodeBottomSheet
        visible={joinCodeModalVisible}
        onClose={() => setJoinCodeModalVisible(false)}
        onSubmit={handleJoin}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundCircle: {
    position: "absolute",
    opacity: 0.35,
  },
  backgroundCircle1: {
    top: "8%",
    left: "-12%",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
  },
  backgroundCircle2: {
    top: "22%",
    right: "-10%",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
  },
  backgroundCircle3: {
    bottom: "25%",
    left: "-8%",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
  },
  backgroundCircle4: {
    bottom: "40%",
    right: "-6%",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: spacing.lg,
  },
  backButtonPressed: {
    backgroundColor: colors.surface + "80",
  },
  usernameButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexShrink: 0,
  },
  usernameButtonPressed: {
    opacity: 0.9,
  },
  usernameButtonText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    alignItems: "center",
  },
  heroImageContainer: {
    width: "55%",
    maxWidth: 200,
    aspectRatio: 1,
    marginBottom: spacing.lg,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  errorContainer: {
    backgroundColor: colors.danger + "20",
    borderRadius: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    width: "100%",
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
  configCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  configCardLabel: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  configCardLabelSecond: {
    marginTop: spacing.md,
  },
  configValue: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
  },
  configValueNumber: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.primary,
  },
  actions: {
    width: "100%",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  createGameButton: {
    alignSelf: "center",
  },
  footerJoin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: "100%",
  },
  haveCodeText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  joinCtaButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  joinCtaButtonPressed: {
    backgroundColor: colors.primary + "25",
  },
  joinCtaButtonDisabled: {
    opacity: 0.6,
  },
  joinCtaLabel: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.primary,
  },
  joinCtaLabelDisabled: {
    color: colors.textSecondary,
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
