export type DiceProps = {
  values: readonly [number, number];
  isRolling: boolean;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  /** Die edge length in points. */
  size?: number;
};

export type DieProps = {
  value: number;
  isRolling: boolean;
  size: number;
  /** Resting tilt in degrees, so the pair looks thrown rather than aligned. */
  tilt: number;
  face: string;
};
