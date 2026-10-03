import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SHORT_CODE_LENGTH } from "@seven/protocol";
import { illustrations } from "@/src/core/assets/illustrations";
import { AppText } from "@/src/core/components/AppText/AppText";
import { GlassSurface } from "@/src/core/components/GlassSurface/GlassSurface";
import { IconButton } from "@/src/core/components/IconButton/IconButton";
import { PosterScreen } from "@/src/core/components/PosterScreen/PosterScreen";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useGoHome } from "@/src/features/game/hooks/useGameExit";
import { NamePill } from "@/src/features/online/components/NamePill/NamePill";
import { UsernameBottomSheet } from "@/src/features/online/components/UsernameBottomSheet/UsernameBottomSheet";
import { useOnlineLobby } from "@/src/features/online/hooks/useOnlineLobby";
import { colors } from "@/src/theme/colors";
import { shadows } from "@/src/theme/shadows";
import { radii } from "@/src/theme/spacing";
import { fonts } from "@/src/theme/typography";

/** "La mesa está servida": create a table or join one with a friend's code. */
export const OnlineLobbyScreen: React.FC = () => {
  const { t } = useLanguage();
  const goHome = useGoHome();
  const lobby = useOnlineLobby();
  const [isNameSheetVisible, setNameSheetVisible] = useState(false);
  const [code, setCode] = useState("");
  const canJoin = code.trim().length === SHORT_CODE_LENGTH && !lobby.isConnecting;

  const handleNameSubmit = async (name: string) => {
    await lobby.changeName(name);
    setNameSheetVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <PosterScreen
        testID="lobby-screen"
        source={illustrations.lobby}
        imageOffset={-120}
        fadeStart={0.39}
        eyebrow={t("online.lobby.eyebrow")}
        title={t("online.lobby.title")}
        titleSize="title"
        topLeft={
          <IconButton icon="chevron-back" accessibilityLabel={t("online.lobby.back")} onPress={goHome} />
        }
        topRight={
          lobby.displayName ? (
            <NamePill name={lobby.displayName} onPress={() => setNameSheetVisible(true)} />
          ) : null
        }
      >
        {lobby.error && (
          <GlassSurface strong style={styles.error} accessibilityRole="alert">
            <AppText variant="label" tone="strong">
              {lobby.error}
            </AppText>
          </GlassSurface>
        )}

        <View style={[styles.card, shadows.card]}>
          <AppText variant="heading" tone="dark">
            {t("online.lobby.createTitle")}
          </AppText>
          <AppText variant="caption" tone="darkMuted">
            {t("online.lobby.createSubtitle")}
          </AppText>
          <PrimaryButton
            label={t("online.lobby.createGame")}
            icon="add-circle-outline"
            onPress={lobby.createGame}
            loading={lobby.isConnecting}
            style={styles.createButton}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <AppText variant="caption" tone="muted">
            {t("online.lobby.invited")}
          </AppText>
          <View style={styles.line} />
        </View>

        <View style={styles.joinRow}>
          <GlassSurface style={styles.inputSurface}>
            <TextInput
              value={code}
              onChangeText={(value) => setCode(value.replace(/[^a-z0-9]/gi, "").toUpperCase())}
              placeholder={t("online.lobby.codePlaceholder")}
              placeholderTextColor={colors.textMuted}
              accessibilityLabel={t("online.lobby.codeLabel")}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={SHORT_CODE_LENGTH}
              returnKeyType="go"
              onSubmitEditing={() => canJoin && lobby.joinGame(code)}
              style={styles.input}
            />
          </GlassSurface>
          <Pressable
            onPress={() => lobby.joinGame(code)}
            disabled={!canJoin}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canJoin }}
            style={({ pressed }) => [styles.joinButton, !canJoin && styles.disabled, pressed && styles.pressed]}
          >
            <AppText variant="bodyStrong" tone="dark">
              {t("online.lobby.joinCta")}
            </AppText>
          </Pressable>
        </View>
      </PosterScreen>

      <UsernameBottomSheet
        visible={isNameSheetVisible}
        onClose={() => setNameSheetVisible(false)}
        onSubmit={handleNameSubmit}
        initialValue={lobby.displayName}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  error: { borderRadius: radii.md, padding: 14 },
  card: {
    gap: 6,
    padding: 18,
    borderRadius: radii.xl,
    backgroundColor: colors.sand,
  },
  createButton: { marginTop: 10 },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 2 },
  line: { flex: 1, height: 1, backgroundColor: colors.divider },
  joinRow: { flexDirection: "row", gap: 10 },
  inputSurface: { flex: 1, height: 54, borderRadius: radii.md, justifyContent: "center" },
  input: {
    height: 54,
    paddingHorizontal: 16,
    fontFamily: fonts.displayBold,
    fontSize: 20,
    letterSpacing: 4,
    color: colors.textPrimary,
  },
  joinButton: {
    height: 54,
    paddingHorizontal: 22,
    borderRadius: radii.md,
    backgroundColor: colors.sun,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});
