import { DISPLAY_NAME_MAX_LENGTH } from "@seven/protocol";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { AppText } from "@/src/core/components/AppText/AppText";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { SandSheet } from "@/src/core/components/SandSheet/SandSheet";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import type { UsernameBottomSheetProps } from "@/src/features/online/components/UsernameBottomSheet/UsernameBottomSheet.types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/typography";

const FOCUS_DELAY_MS = 260;

/** Asks for the name shown to the rival. */
export const UsernameBottomSheet: React.FC<UsernameBottomSheetProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValue = "",
}) => {
  const { t } = useLanguage();
  // null until the player types, so the sheet always opens with the current name.
  const [draft, setDraft] = useState<string | null>(null);
  const name = draft ?? initialValue;
  const isValid = name.trim().length > 0;
  const inputRef = useRef<TextInput>(null);

  // Focus once the sheet has slid in: focusing mid-animation can leave Android's keyboard
  // detached from the field.
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  const handleDismiss = () => {
    setDraft(null);
    onClose();
  };

  const handleSubmit = () => {
    if (isValid) onSubmit(name.trim());
  };

  return (
    <SandSheet visible={visible} onDismiss={handleDismiss} withKeyboard>
      <AppText variant="heading" tone="dark" accessibilityRole="header">
        {t("online.username.title")}
      </AppText>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={t("online.username.placeholder")}
          placeholderTextColor={colors.textOnSandMuted}
          accessibilityLabel={t("online.username.placeholder")}
          value={name}
          onChangeText={setDraft}
          maxLength={DISPLAY_NAME_MAX_LENGTH}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        <AppText variant="caption" tone="darkMuted" style={styles.counter}>
          {name.length}/{DISPLAY_NAME_MAX_LENGTH}
        </AppText>
      </View>
      <PrimaryButton label={t("online.username.continue")} onPress={handleSubmit} disabled={!isValid} />
    </SandSheet>
  );
};

const styles = StyleSheet.create({
  inputWrapper: { justifyContent: "center" },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.sandBorder,
    backgroundColor: "rgba(255,255,255,0.45)",
    paddingHorizontal: 16,
    paddingRight: 64,
    fontFamily: fonts.bodySemiBold,
    fontSize: 17,
    color: colors.textOnSand,
  },
  counter: { position: "absolute", right: 16 },
});
