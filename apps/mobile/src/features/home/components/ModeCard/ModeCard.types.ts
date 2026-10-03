import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

export type ModeCardProps = {
  icon: IoniconsName;
  label: string;
  description: string;
  selected?: boolean;
  disabled?: boolean;
  badge?: string;
  isTablet?: boolean;
  isLargeTablet?: boolean;
  onPress: () => void;
};
