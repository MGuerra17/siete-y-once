import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { styles } from "@/src/features/home/screens/HomeScreen/HomeScreen.styles";
import type { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

export type ModeCardProps = {
  icon: IoniconsName;
  label: string;
  description: string;
  selected?: boolean;
  disabled?: boolean;
  badge?: string;
  onPress: () => void;
};

/** Selectable card for choosing a game mode (offline / online). */
export const ModeCard: React.FC<ModeCardProps> = ({
  icon,
  label,
  description,
  selected = false,
  disabled = false,
  badge,
  onPress,
}) => {
  const iconColor = disabled
    ? colors.textSecondary
    : selected
      ? colors.primary
      : colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.modeCard,
        selected && styles.modeCardActive,
        disabled && styles.modeCardDisabled,
      ]}
    >
      {badge && (
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>{badge}</Text>
        </View>
      )}
      <View
        style={[
          styles.modeCardIconWrapper,
          selected && styles.modeCardIconWrapperActive,
          disabled && styles.modeCardIconWrapperDisabled,
        ]}
      >
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text
        style={[
          styles.modeLabel,
          selected && styles.modeLabelActive,
          disabled && styles.modeLabelDisabled,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.modeDescription,
          selected && styles.modeDescriptionActive,
          disabled && styles.modeDescriptionDisabled,
        ]}
      >
        {description}
      </Text>
    </Pressable>
  );
};
