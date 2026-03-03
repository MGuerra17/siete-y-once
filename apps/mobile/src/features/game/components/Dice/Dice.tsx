import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { styles } from "./Dice.styles";
import { DiceProps } from "./Dice.types";

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  onPress,
  disabled,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [displayValue, setDisplayValue] = useState(value);

  // Keep display value in sync with final value when not rolling
  useEffect(() => {
    if (!isRolling) {
      setDisplayValue(value);
    }
  }, [value, isRolling]);

  // Handle scale animation loop
  useEffect(() => {
    if (isRolling) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 80,
            useNativeDriver: true,
          }),
        ]),
      );

      animationRef.current = loop;
      loop.start();
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }

      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [isRolling, scale]);

  // Change numbers quickly while rolling
  useEffect(() => {
    if (isRolling) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const randomValue = Math.floor(Math.random() * 6) + 1;
        setDisplayValue(randomValue);
      }, 60);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setDisplayValue(value);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRolling, value]);

  const renderPips = (pipValue: number) => {
    const v = Math.min(Math.max(pipValue, 1), 6);

    const showTopLeft = [2, 3, 4, 5, 6].includes(v);
    const showBottomLeft = [4, 5, 6].includes(v);
    const showCenterLeft = [6].includes(v);

    const showCenter = [1, 3, 5].includes(v);

    const showTopRight = [4, 5, 6].includes(v);
    const showBottomRight = [2, 3, 4, 5, 6].includes(v);
    const showCenterRight = [6].includes(v);

    return (
      <View style={styles.pipsContainer}>
        <View style={styles.pipColumn}>
          <View
            style={[
              styles.pip,
              !showTopLeft && styles.pipTransparent,
            ]}
          />
          <View
            style={[
              styles.pip,
              !showCenterLeft && styles.pipTransparent,
            ]}
          />
          <View
            style={[
              styles.pip,
              !showBottomLeft && styles.pipTransparent,
            ]}
          />
        </View>
        <View style={styles.pipColumn}>
          <View
            style={[
              styles.pip,
              styles.pipTransparent,
            ]}
          />
          <View
            style={[
              styles.pip,
              !showCenter && styles.pipTransparent,
            ]}
          />
          <View
            style={[
              styles.pip,
              styles.pipTransparent,
            ]}
          />
        </View>
        <View style={styles.pipColumn}>
          <View
            style={[
              styles.pip,
              !showTopRight && styles.pipTransparent,
            ]}
          />
          <View
            style={[
              styles.pip,
              !showCenterRight && styles.pipTransparent,
            ]}
          />
          <View
            style={[
              styles.pip,
              !showBottomRight && styles.pipTransparent,
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.die,
          { transform: [{ scale }] },
          disabled && styles.dieDisabled,
        ]}
      >
        {renderPips(displayValue)}
      </Animated.View>
    </Pressable>
  );
};
