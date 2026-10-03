import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import type { DiceProps, DieProps } from "@/src/features/game/components/Dice/Dice.types";
import { pipBoxes } from "@/src/features/game/components/Dice/dieLayout";
import { useDiceAnimation } from "@/src/features/game/hooks/useDiceAnimation";
import { colors } from "@/src/theme/colors";

/** One top-down die: ivory face, sea-colored pips, soft shadow on the felt. */
export const Die: React.FC<DieProps> = ({ value, isRolling, size, tilt, face }) => {
  const { displayValue, animatedStyle } = useDiceAnimation(isRolling, value);
  const radius = size * 0.22;

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.shadow,
          { width: size, height: size, borderRadius: radius, transform: [{ rotate: `${tilt}deg` }] },
        ]}
      />
      <Animated.View style={animatedStyle}>
        <View
          testID="die-face"
          style={[
            styles.face,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: face,
              transform: [{ rotate: `${tilt}deg` }],
            },
          ]}
        >
          {pipBoxes(displayValue, size).map((pip, index) => (
            <View
              key={index}
              testID="die-pip"
              style={[
                styles.pip,
                { left: pip.left, top: pip.top, width: pip.size, height: pip.size, borderRadius: pip.size / 2 },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

/** The pair of dice; tapping either rolls when allowed. */
export const Dice: React.FC<DiceProps> = ({
  values,
  isRolling,
  onPress,
  disabled,
  accessibilityLabel,
  size = 108,
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    accessibilityState={{ disabled: !!disabled, busy: isRolling }}
    accessibilityValue={{ text: `${values[0]} + ${values[1]}` }}
    style={styles.row}
  >
    <Die value={values[0]} isRolling={isRolling} size={size} tilt={-8} face={colors.diceFace} />
    <Die value={values[1]} isRolling={isRolling} size={size} tilt={7} face={colors.diceFaceAlt} />
  </Pressable>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 24, alignItems: "center", justifyContent: "center" },
  shadow: {
    position: "absolute",
    left: 8,
    top: 14,
    backgroundColor: "rgba(4, 22, 24, 0.45)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    opacity: 0.8,
  },
  face: {
    overflow: "hidden",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(13, 59, 62, 0.12)",
  },
  pip: {
    position: "absolute",
    backgroundColor: colors.background,
  },
});
