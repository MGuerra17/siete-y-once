import { useEffect, useState } from "react";
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const SCALE_UP = 1.1;
const SCALE_DOWN = 0.9;
const BOUNCE_MS = 80;
const FACE_INTERVAL_MS = 60;

const randomFace = () => Math.floor(Math.random() * 6) + 1;

/**
 * Dice roll animation: a bounce running on the UI thread plus random faces while
 * rolling. Shows `finalValue` as soon as the roll ends.
 */
export const useDiceAnimation = (isRolling: boolean, finalValue: number) => {
  const scale = useSharedValue(1);
  const [rollingFace, setRollingFace] = useState(finalValue);

  useEffect(() => {
    if (!isRolling) {
      scale.set(withTiming(1, { duration: BOUNCE_MS }));
      return;
    }
    scale.set(
      withRepeat(
        withSequence(
          withTiming(SCALE_UP, { duration: BOUNCE_MS }),
          withTiming(SCALE_DOWN, { duration: BOUNCE_MS }),
        ),
        -1,
      ),
    );
    const interval = setInterval(() => setRollingFace(randomFace()), FACE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      cancelAnimation(scale);
    };
  }, [isRolling, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return { displayValue: isRolling ? rollingFace : finalValue, animatedStyle };
};
