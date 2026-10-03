import type { Ionicons } from "@expo/vector-icons";
import type React from "react";
import type { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";

export type IconName = React.ComponentProps<typeof Ionicons>["name"];

export type PrimaryButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  /** Extra content on the right, e.g. a countdown badge. */
  accessory?: React.ReactNode;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};
