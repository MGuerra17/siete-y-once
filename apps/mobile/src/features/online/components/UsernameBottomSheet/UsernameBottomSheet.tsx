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

const USERNAME_MAX_LENGTH = 15;

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
        <View style={styles.inputWrapper}>
          <BottomSheetTextInput
            style={styles.input}
            placeholder={t("online.username.placeholder")}
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
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
  inputWrapper: {
    position: "relative",
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingRight: spacing.xl * 2,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  charCounter: {
    position: "absolute",
    right: spacing.md,
    top: "50%",
    transform: [{ translateY: -fontSize.xs / 2 }],
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
});
