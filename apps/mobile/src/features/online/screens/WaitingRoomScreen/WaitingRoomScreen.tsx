import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";
import { wsService } from "@/src/features/online/services/WebSocketService";
import { useOnlineStore } from "@/src/features/online/store/onlineStore";
import { useGameStore } from "@/src/features/game/store/gameStore";
import { mapServerStateToStore } from "@/src/features/online/utils/mapServerState";
import { setSession } from "@/src/features/online/utils/storage";
import type {
  ServerGameStateMessage,
  ServerMessage,
} from "@/src/features/online/types/server";

export const WaitingRoomScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isCreator = role === "creator";

  const shortCode = useOnlineStore((s) => s.shortCode);
  const [copied, setCopied] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setCopied(false);
    }, []),
  );

  useEffect(() => {
    const unsubscribe = wsService.onMessage((data: ServerMessage) => {
      if (data.type !== "gameState") return;
      const msg = data as ServerGameStateMessage;

      if (msg.event === "playerJoined" && msg.game) {
        const onlineState = useOnlineStore.getState();
        const mySlot = onlineState.myPlayerSlot ?? "player1";
        const storeUpdate = mapServerStateToStore(msg.game, mySlot);
        useGameStore.setState({
          ...storeUpdate,
          isRolling: false,
          isProcessing: false,
          isBetSheetVisible: false,
          toastMessage: null,
        });
        useOnlineStore.getState().setOpponentConnected(true);
        router.replace({ pathname: "/game", params: { mode: "online" } });
        return;
      }

      if (msg.event === "joined" && msg.game) {
        if (msg.rejoinToken && msg.shortCode) {
          useOnlineStore
            .getState()
            .setSession(
              msg.game.gameId,
              msg.shortCode,
              msg.rejoinToken,
              "player2",
            );
          setSession({
            gameId: msg.game.gameId,
            rejoinToken: msg.rejoinToken,
            myPlayerSlot: "player2",
          });
        }
        const mySlot = useOnlineStore.getState().myPlayerSlot ?? "player2";
        const storeUpdate = mapServerStateToStore(msg.game, mySlot);
        useGameStore.setState({
          ...storeUpdate,
          isRolling: false,
          isProcessing: false,
          isBetSheetVisible: false,
          toastMessage: null,
        });
        useOnlineStore.getState().setOpponentConnected(true);
        router.replace({ pathname: "/game", params: { mode: "online" } });
        return;
      }

      if (msg.event === "gameCreated") {
        if (msg.gameId && msg.shortCode && msg.rejoinToken) {
          useOnlineStore
            .getState()
            .setSession(msg.gameId, msg.shortCode, msg.rejoinToken, "player1");
          setSession({
            gameId: msg.gameId,
            rejoinToken: msg.rejoinToken,
            myPlayerSlot: "player1",
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  const handleCopyCode = async () => {
    if (!shortCode) return;
    await Clipboard.setStringAsync(shortCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = () => {
    wsService.disconnect();
    useOnlineStore.getState().reset();
    useGameStore.getState().resetGame();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>{t("online.waiting.title")}</Text>

        {isCreator && shortCode && (
          <View style={styles.codeSection}>
            <Text style={styles.shareCodeLabel}>
              {t("online.waiting.shareCodeLabel")}
            </Text>
            <Pressable onPress={handleCopyCode} style={styles.codeCard}>
              <Text style={styles.codeLabel}>
                {t("online.waiting.copyCode")}
              </Text>
              <Text style={styles.codeText}>{shortCode}</Text>
              <View style={styles.copyRow}>
                <Ionicons
                  name={copied ? "checkmark-circle" : "copy-outline"}
                  size={18}
                  color={copied ? colors.success : colors.textSecondary}
                />
                <Text
                  style={[styles.copyText, copied && { color: colors.success }]}
                >
                  {copied
                    ? t("online.waiting.codeCopied")
                    : t("online.waiting.copyCode")}
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        <View style={styles.waitingSection}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.waitingText}>
            {isCreator
              ? t("online.waiting.waitingForOpponent")
              : t("online.waiting.connecting")}
          </Text>
        </View>

        <Pressable onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>{t("online.waiting.cancel")}</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    alignItems: "center",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xxl,
  },
  codeSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  shareCodeLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  codeCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
    gap: spacing.md,
    width: "100%",
    maxWidth: 300,
  },
  codeLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  codeText: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 8,
  },
  copyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  copyText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  waitingSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
  },
  waitingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
  cancelButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  cancelText: {
    fontSize: fontSize.md,
    color: colors.danger,
    fontWeight: "600",
  },
});
