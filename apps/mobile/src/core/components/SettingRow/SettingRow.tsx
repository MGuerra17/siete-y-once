import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, View } from "react-native";
import { AppText } from "@/src/core/components/AppText/AppText";
import type { IconName } from "@/src/core/components/PrimaryButton/PrimaryButton.types";
import { colors } from "@/src/theme/colors";

type SettingRowProps = {
  icon: IconName;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

/** Labeled switch row for sand sheets. */
export const SettingRow: React.FC<SettingRowProps> = ({ icon, label, value, onChange }) => (
  <View style={styles.row}>
    <Ionicons name={icon} size={20} color={colors.textOnSand} />
    <AppText variant="bodyStrong" tone="dark" style={styles.label}>
      {label}
    </AppText>
    <Switch
      value={value}
      onValueChange={onChange}
      accessibilityLabel={label}
      trackColor={{ false: "rgba(13,59,62,0.2)", true: colors.background }}
      thumbColor={colors.ivory}
      ios_backgroundColor="rgba(13,59,62,0.2)"
    />
  </View>
);

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "rgba(13,59,62,0.07)",
  },
  label: { flex: 1 },
});
