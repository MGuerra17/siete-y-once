import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import * as Clipboard from "expo-clipboard";
import { styles } from "@/src/features/online/components/JoinCodeBottomSheet/JoinCodeBottomSheet.styles";
import type { JoinCodeBottomSheetProps } from "@/src/features/online/components/JoinCodeBottomSheet/JoinCodeBottomSheet.types";
import { SHORT_CODE_LENGTH } from "@seven/protocol";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { colors } from "@/src/theme/colors";



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
    if (visible) bottomSheetRef.current?.present();
    else bottomSheetRef.current?.dismiss();
  }, [visible]);

  const handleDismiss = () => {
    setCode("");
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length === SHORT_CODE_LENGTH && !loading) {
      onSubmit(trimmed);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      const pasted = text
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, SHORT_CODE_LENGTH);
      setCode(pasted);
    } catch {
      // Clipboard read failed (e.g. permission denied); leave code unchanged
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
      onDismiss={handleDismiss}
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
          <View style={styles.inputWrapper}>
            <BottomSheetTextInput
              style={styles.input}
              placeholder={t("online.lobby.codePlaceholder")}
              placeholderTextColor={colors.textSecondary}
              value={code}
              onChangeText={(text) => setCode(text.toUpperCase())}
              maxLength={SHORT_CODE_LENGTH}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>
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
            disabled={code.trim().length !== SHORT_CODE_LENGTH || loading}
            loading={loading}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
