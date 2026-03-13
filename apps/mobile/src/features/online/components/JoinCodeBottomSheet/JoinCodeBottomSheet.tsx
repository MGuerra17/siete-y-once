import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

type JoinCodeBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  loading?: boolean;
  errorMessage?: string | null;
};

export const JoinCodeBottomSheet: React.FC<JoinCodeBottomSheetProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  errorMessage,
}) => {
  const { t } = useLanguage();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!bottomSheetRef.current) return;
    if (visible) {
      setCode("");
      bottomSheetRef.current.present();
    } else {
      bottomSheetRef.current.dismiss();
    }
  }, [visible]);

  const handleSubmit = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length === 6 && !loading) {
      onSubmit(trimmed);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      const pasted = text.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
      setCode(pasted);
    } catch {
      // ignore clipboard errors
    }
  };

  const renderBackdrop = (
    backdropProps: Parameters<typeof BottomSheetBackdrop>[0],
  ) => (
    <BottomSheetBackdrop
      {...backdropProps}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={onClose}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.modal}
      backgroundStyle={styles.background}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>
          {t("online.lobby.joinCodeModal.title")}
        </Text>
        <View style={styles.inputRow}>
          <BottomSheetTextInput
            style={styles.input}
            placeholder={t("online.lobby.codePlaceholder")}
            placeholderTextColor={colors.textSecondary}
            value={code}
            onChangeText={(text) => setCode(text.toUpperCase())}
            maxLength={6}
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <Pressable
            onPress={handlePaste}
            style={({ pressed }) => [
              styles.pasteButton,
              pressed && styles.pasteButtonPressed,
            ]}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={t("online.lobby.pasteCode")}
          >
            <Ionicons
              name="clipboard-outline"
              size={22}
              color={colors.primary}
            />
          </Pressable>
        </View>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            label={t("online.lobby.join")}
            onPress={handleSubmit}
            disabled={code.trim().length !== 6 || loading}
            loading={loading}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  background: {
    backgroundColor: colors.background,
  },
  handleIndicator: {
    backgroundColor: colors.border,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
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
  pasteButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pasteButtonPressed: {
    opacity: 0.7,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    color: colors.danger,
    textAlign: "center",
  },
});
