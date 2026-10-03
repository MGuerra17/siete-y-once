import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { styles } from "@/src/features/online/components/UsernameBottomSheet/UsernameBottomSheet.styles";
import type { UsernameBottomSheetProps } from "@/src/features/online/components/UsernameBottomSheet/UsernameBottomSheet.types";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { colors } from "@/src/theme/colors";


const USERNAME_MAX_LENGTH = 15;

export const UsernameBottomSheet: React.FC<UsernameBottomSheetProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValue = "",
}) => {
  const { t } = useLanguage();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  // null until the player types, so the sheet always opens with the current name.
  const [draft, setDraft] = useState<string | null>(null);
  const name = draft ?? initialValue;

  useEffect(() => {
    if (visible) bottomSheetRef.current?.present();
    else bottomSheetRef.current?.dismiss();
  }, [visible]);

  const handleDismiss = () => {
    setDraft(null);
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      onSubmit(trimmed);
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
        <Text style={styles.title}>{t("online.username.title")}</Text>
        <View style={styles.inputWrapper}>
          <BottomSheetTextInput
            style={styles.input}
            placeholder={t("online.username.placeholder")}
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setDraft}
            maxLength={USERNAME_MAX_LENGTH}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <Text style={styles.charCounter}>
            {name.length}/{USERNAME_MAX_LENGTH}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            label={t("online.username.continue")}
            onPress={handleSubmit}
            disabled={name.trim().length === 0}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
