import React, { useEffect, useState } from "react";
import { GameScreen } from "@/src/features/game/screens/GameScreen/GameScreen";
import { useOnlineGameScreen } from "@/src/features/online/hooks/useOnlineGameScreen";
import { Modal, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

export const OnlineGameScreen: React.FC = () => {
  const {
    screenProps,
    isOnline,
    isCreator,
    showCodeModal,
    shortCode,
    handleCopyCode,
    handleGoHome,
  } = useOnlineGameScreen();

  const showOverlay = isOnline && isCreator && showCodeModal && shortCode;

  const [copied, setCopied] = useState(false);

  const handleCopyWithFeedback = async () => {
    await handleCopyCode();
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <>
      <GameScreen {...screenProps} />
      {showOverlay && (
        <Modal
          transparent
          animationType="fade"
          visible
          onRequestClose={() => {
            // Modal solo se cierra automáticamente cuando se conecta el oponente.
          }}
        >
          <View style={styles.codeModalBackdrop}>
            <View style={styles.codeModalCard}>
              <Text style={styles.codeModalTitle}>Código de partida</Text>
              <Text style={styles.codeModalCode}>{shortCode}</Text>

              <Pressable
                style={styles.codeModalGhostButton}
                onPress={handleCopyWithFeedback}
              >
                <Ionicons
                  name="copy-outline"
                  size={16}
                  color={colors.textSecondary}
                  style={styles.codeModalGhostIcon}
                />
                <Text style={styles.codeModalGhostLabel}>
                  {copied ? "Código copiado" : "Copiar código"}
                </Text>
              </Pressable>

              <View style={styles.codeModalActionsRow}>
                <Pressable
                  style={[
                    styles.codeModalActionButton,
                    styles.codeModalExitButton,
                  ]}
                  onPress={handleGoHome}
                >
                  <Text
                    style={[
                      styles.codeModalActionLabel,
                      styles.codeModalExitLabel,
                    ]}
                  >
                    Salir
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.codeModalActionButton,
                    styles.codeModalPrimaryButton,
                  ]}
                  onPress={async () => {
                    if (!shortCode) return;
                    try {
                      await Share.share({
                        message: `Únete a mi partida con este código: ${shortCode}`,
                      });
                    } catch {
                      // ignore
                    }
                  }}
                >
                  <Text style={styles.codeModalPrimaryLabel}>Compartir</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  codeModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  codeModalCard: {
    width: "80%",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.xl,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    gap: spacing.md,
  },
  codeModalTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  codeModalCode: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    letterSpacing: 8,
    color: colors.primary,
  },
  codeModalGhostButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  codeModalGhostIcon: {
    opacity: 0.8,
  },
  codeModalGhostLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  codeModalActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  codeModalActionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  codeModalExitButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  codeModalPrimaryButton: {
    backgroundColor: colors.primary,
  },
  codeModalActionLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  codeModalExitLabel: {
    color: colors.textSecondary,
  },
  codeModalPrimaryLabel: {
    color: colors.background,
  },
});
