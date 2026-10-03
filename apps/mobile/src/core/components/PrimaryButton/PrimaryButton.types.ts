import type {
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from "react-native";

export type PrimaryButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

