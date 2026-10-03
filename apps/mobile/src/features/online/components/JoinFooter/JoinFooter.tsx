import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBreakpoints } from "@/src/core/hooks/useBreakpoints";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { styles } from "@/src/features/online/components/JoinFooter/JoinFooter.styles";
import type { JoinFooterProps } from "@/src/features/online/components/JoinFooter/JoinFooter.types";
import { spacing } from "@/src/theme/spacing";

/** "Do you have a game code?" footer with the join button. */
export const JoinFooter: React.FC<JoinFooterProps> = ({ disabled, onJoinPress }) => {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { isTablet, isLargeTablet } = useBreakpoints();
  return (
    <View
      style={[
        styles.footerJoin,
        isTablet && styles.footerJoinTablet,
        isLargeTablet && styles.footerJoinLargeTablet,
        { paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <Text style={styles.haveCodeText}>{t("online.lobby.haveCodeQuestion")}</Text>
      <Pressable
        onPress={onJoinPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        style={({ pressed }) => [
          styles.joinCtaButton,
          pressed && !disabled && styles.joinCtaButtonPressed,
          disabled && styles.joinCtaButtonDisabled,
        ]}
      >
        <Text style={[styles.joinCtaLabel, disabled && styles.joinCtaLabelDisabled]}>
          {t("online.lobby.joinCta")}
        </Text>
      </Pressable>
    </View>
  );
};
