import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { styles } from "@/src/features/home/components/ModeCard/ModeCard.styles";
import type { ModeCardProps } from "@/src/features/home/components/ModeCard/ModeCard.types";


/** Selectable card for choosing a game mode (offline / online). */
export const ModeCard: React.FC<ModeCardProps> = ({
  icon,
  label,
  description,
  selected = false,
  disabled = false,
  badge,
  isTablet = false,
  isLargeTablet = false,
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
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${description}`}
      accessibilityState={{ disabled: !!disabled, selected: !!selected }}
      style={[
        styles.modeCard,
        isTablet && styles.modeCardTablet,
        isLargeTablet && styles.modeCardLargeTablet,
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
          isTablet && styles.modeLabelTablet,
          selected && styles.modeLabelActive,
          disabled && styles.modeLabelDisabled,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.modeDescription,
          isTablet && styles.modeDescriptionTablet,
          selected && styles.modeDescriptionActive,
          disabled && styles.modeDescriptionDisabled,
        ]}
      >
        {description}
      </Text>
    </Pressable>
  );
};
