import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { styles } from "@/src/features/online/components/LobbyHeader/LobbyHeader.styles";
import type { LobbyHeaderProps } from "@/src/features/online/components/LobbyHeader/LobbyHeader.types";
import { colors } from "@/src/theme/colors";

/** Back button and the editable player name pill. */
export const LobbyHeader: React.FC<LobbyHeaderProps> = ({ displayName, onBack, onEditName }) => {
  const { t } = useLanguage();
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        accessibilityRole="button"
        accessibilityLabel={t("online.waiting.cancel")}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </Pressable>
      <Pressable
        onPress={onEditName}
        style={({ pressed }) => [styles.usernameButton, pressed && styles.usernameButtonPressed]}
        accessibilityRole="button"
        accessibilityLabel={t("online.username.title")}
      >
        <Text style={styles.usernameButtonText} numberOfLines={1} ellipsizeMode="tail">
          {displayName}
        </Text>
        <Ionicons name="pencil-outline" size={14} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
};
