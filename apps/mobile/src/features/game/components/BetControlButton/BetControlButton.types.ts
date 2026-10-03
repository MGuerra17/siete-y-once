export type BetControlButtonProps = {
  label: string;
  type: "increase" | "decrease";
  disabled?: boolean;
  small?: boolean;
  onPress: () => void;
};
