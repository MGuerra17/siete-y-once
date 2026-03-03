import type { GestureResponderEvent, ViewStyle } from "react-native";

export type PrimaryButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
};

