import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

type UsernameBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialValue?: string;
};

export const UsernameBottomSheet: React.FC<UsernameBottomSheetProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValue = "",
}) => {
  const { t } = useLanguage();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [name, setName] = useState(initialValue);

  useEffect(() => {
    if (!bottomSheetRef.current) return;
    if (visible) {
      setName(initialValue);
      bottomSheetRef.current.present();
    } else {
      bottomSheetRef.current.dismiss();
    }
  }, [visible, initialValue]);

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
      onDismiss={onClose}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.modal}
      backgroundStyle={styles.background}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>{t("online.username.title")}</Text>
        <BottomSheetTextInput
          style={styles.input}
          placeholder={t("online.username.placeholder")}
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
          maxLength={50}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
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

const styles = StyleSheet.create({
  modal: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  background: {
    backgroundColor: colors.surface,
  },
  handleIndicator: {
    backgroundColor: colors.border,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
});
