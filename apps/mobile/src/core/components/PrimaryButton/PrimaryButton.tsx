import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { styles } from "@/src/core/components/PrimaryButton/PrimaryButton.styles";
import type { PrimaryButtonProps } from "@/src/core/components/PrimaryButton/PrimaryButton.types";
import { colors } from "@/src/theme/colors";

/** Coral call-to-action. `children` render behind the label (e.g. a progress fill). */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled,
  loading,
  icon,
  accessory,
  accessibilityHint,
  style,
  children,
}) => {
  const isDisabled = !!disabled || !!loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {children}
      {loading ? (
        <ActivityIndicator color={colors.textOnCoral} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color={colors.textOnCoral} />}
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
          {accessory}
        </>
      )}
    </Pressable>
  );
};
