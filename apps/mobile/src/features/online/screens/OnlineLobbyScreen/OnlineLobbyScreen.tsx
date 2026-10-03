import React, { useCallback, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
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
import { RadialCircle } from "@/src/features/home/components/RadialCircle/RadialCircle";
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
  const { width } = useWindowDimensions();
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
            router.replace({
              pathname: "/game",
              params: { mode: "online", showCode: "1" },
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

  const isTablet = width >= 600;
  const isLargeTablet = width >= 840;

  return (
    <ScreenContainer>
      {Platform.OS !== "android" && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <View style={styles.backgroundLayer}>
            <RadialCircle
              size={isTablet ? 280 : 150}
              color={colors.primary}
              opacity={isTablet ? 0.35 : 0.4}
              style={[
                styles.backgroundCircle,
                isTablet && styles.backgroundCircleTablet,
                styles.backgroundCircle1,
                isTablet && styles.backgroundCircle1Tablet,
              ]}
            />
            <RadialCircle
              size={isTablet ? 260 : 140}
              color={colors.primary}
              opacity={isTablet ? 0.35 : 0.4}
              style={[
                styles.backgroundCircle,
                isTablet && styles.backgroundCircleTablet,
                styles.backgroundCircle2,
                isTablet && styles.backgroundCircle2Tablet,
              ]}
            />
            <RadialCircle
              size={isTablet ? 240 : 130}
              color={colors.primary}
              opacity={isTablet ? 0.35 : 0.4}
              style={[
                styles.backgroundCircle,
                isTablet && styles.backgroundCircleTablet,
                styles.backgroundCircle3,
                isTablet && styles.backgroundCircle3Tablet,
              ]}
            />
            <RadialCircle
              size={isTablet ? 220 : 120}
              color={colors.primary}
              opacity={isTablet ? 0.35 : 0.4}
              style={[
                styles.backgroundCircle,
                isTablet && styles.backgroundCircleTablet,
                styles.backgroundCircle4,
                isTablet && styles.backgroundCircle4Tablet,
              ]}
            />
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
      <View
        style={[
          styles.container,
          isTablet && styles.containerTablet,
          isLargeTablet && styles.containerLargeTablet,
        ]}
      >
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
            <Text
              style={styles.usernameButtonText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {displayName}
            </Text>
            <Ionicons
              name="pencil-outline"
              size={14}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && styles.scrollContentTablet,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.heroImageContainer,
              isTablet && styles.heroImageContainerTablet,
              isLargeTablet && styles.heroImageContainerLargeTablet,
            ]}
          >
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

          <View
            style={[
              styles.configCard,
              isTablet && styles.configCardTablet,
              isLargeTablet && styles.configCardLargeTablet,
            ]}
          >
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
              loading={isConnecting}
              style={[
                styles.createGameButton,
                ...(isTablet ? [styles.createGameButtonTablet] : []),
              ]}
            />
          </View>
        </ScrollView>

        <View
          style={[
            styles.footerJoin,
            isTablet && styles.footerJoinTablet,
            isLargeTablet && styles.footerJoinLargeTablet,
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
        loading={isConnecting}
        errorMessage={error}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  containerTablet: {
    paddingHorizontal: spacing.xl,
  },
  containerLargeTablet: {
    paddingHorizontal: spacing.xxl,
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundCircle: {
    position: "absolute",
  },
  backgroundCircleTablet: {
  },
  backgroundCircle1: {
    top: "10%",
    left: "-10%",
    width: 120,
    height: 120,
  },
  backgroundCircle1Tablet: {
    left: "-4%",
    width: 190,
    height: 190,
  },
  backgroundCircle2: {
    top: "25%",
    right: "-15%",
    width: 110,
    height: 110,
  },
  backgroundCircle2Tablet: {
    right: "-4%",
    width: 180,
    height: 180,
  },
  backgroundCircle3: {
    bottom: "20%",
    left: "-5%",
    width: 100,
    height: 100,
  },
  backgroundCircle3Tablet: {
    left: "0%",
    width: 170,
    height: 170,
  },
  backgroundCircle4: {
    bottom: "35%",
    right: "-8%",
    width: 90,
    height: 90,
  },
  backgroundCircle4Tablet: {
    right: "0%",
    width: 160,
    height: 160,
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
    flexShrink: 1,
    minWidth: 0,
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
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: spacing.xxl,
    alignItems: "center",
  },
  scrollContentTablet: {
    paddingBottom: spacing.xxl + spacing.lg,
  },
  heroImageContainer: {
    width: "55%",
    maxWidth: 200,
    aspectRatio: 1,
    marginBottom: spacing.lg,
  },
  heroImageContainerTablet: {
    width: "50%",
    maxWidth: 260,
  },
  heroImageContainerLargeTablet: {
    width: "40%",
    maxWidth: 320,
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
  configCardTablet: {
    maxWidth: 420,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  configCardLargeTablet: {
    maxWidth: 480,
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
  createGameButtonTablet: {
    width: "100%",
    maxWidth: 480,
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
  footerJoinTablet: {
    paddingHorizontal: spacing.xl,
  },
  footerJoinLargeTablet: {
    paddingHorizontal: spacing.xxl,
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
