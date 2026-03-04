import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

const SCALE_UP = 1.1;
const SCALE_DOWN = 0.9;
const ANIMATION_DURATION_MS = 80;
const RANDOM_FACE_INTERVAL_MS = 60;

/**
 * Manages the dice rolling animation: bounce scale and random face cycling.
 * Returns the value to display and the animated scale for the transform style.
 */
export const useDiceAnimation = (isRolling: boolean, finalValue: number) => {
  const scale = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [displayValue, setDisplayValue] = useState(finalValue);

  useEffect(() => {
    if (!isRolling) {
      setDisplayValue(finalValue);
    }
  }, [finalValue, isRolling]);

  useEffect(() => {
    if (isRolling) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: SCALE_UP,
            duration: ANIMATION_DURATION_MS,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: SCALE_DOWN,
            duration: ANIMATION_DURATION_MS,
            useNativeDriver: true,
          }),
        ]),
      );
      animationRef.current = loop;
      loop.start();
    } else {
      animationRef.current?.stop();
      animationRef.current = null;
      Animated.timing(scale, {
        toValue: 1,
        duration: ANIMATION_DURATION_MS,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
    };
  }, [isRolling, scale]);

  useEffect(() => {
    if (isRolling) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, RANDOM_FACE_INTERVAL_MS);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setDisplayValue(finalValue);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRolling, finalValue]);

  return { displayValue, scale };
};
