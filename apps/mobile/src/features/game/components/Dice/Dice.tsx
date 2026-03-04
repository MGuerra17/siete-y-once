import React from "react";
import { Animated, Pressable, View } from "react-native";
import { styles } from "@/src/features/game/components/Dice/Dice.styles";
import type { DiceProps } from "@/src/features/game/components/Dice/Dice.types";
import { useDiceAnimation } from "@/src/features/game/hooks/useDiceAnimation";
import { DicePips } from "@/src/features/game/components/DicePips/DicePips";

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  onPress,
  disabled,
  accessibilityLabel,
}) => {
  const { displayValue, scale } = useDiceAnimation(isRolling, value);

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
    >
      <Animated.View
        style={[
          styles.die,
          { transform: [{ scale }] },
          disabled && styles.dieDisabled,
        ]}
      >
        <DicePips value={displayValue} />
      </Animated.View>
    </Pressable>
  );
};
