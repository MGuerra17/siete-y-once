import { GestureResponderEvent } from "react-native";

export type PrimaryButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

