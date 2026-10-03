import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { styles } from "@/src/core/components/PrimaryButton/PrimaryButton.styles";
import { colors } from "@/src/theme/colors";
import { PrimaryButtonProps } from "@/src/core/components/PrimaryButton/PrimaryButton.types";

/** Full-width primary call-to-action button with press and disabled states. */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled,
  loading,
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
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
      <View style={styles.content}>
        <Text style={[styles.label, loading && styles.labelInvisible]}>
          {label}
        </Text>
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator color={colors.textPrimary} size="small" />
          </View>
        )}
      </View>
    </Pressable>
  );
};

