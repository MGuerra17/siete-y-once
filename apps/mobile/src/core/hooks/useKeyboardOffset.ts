import { useEffect } from "react";
import { Keyboard, Platform } from "react-native";
import { useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";

const DEFAULT_DURATION_MS = 250;

/**
 * Height of the on-screen keyboard as a shared value, animated in sync with it.
 * Works the same on iOS and Android edge-to-edge, where the window no longer resizes
 * for the keyboard and KeyboardAvoidingView cannot be relied on inside overlays.
 */
export const useKeyboardOffset = (enabled: boolean): SharedValue<number> => {
  const offset = useSharedValue(0);

  useEffect(() => {
    if (!enabled) {
      offset.set(0);
      return;
    }
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvent, (event) => {
      offset.set(
        withTiming(event.endCoordinates.height, {
          duration: event.duration || DEFAULT_DURATION_MS,
        }),
      );
    });
    const hide = Keyboard.addListener(hideEvent, (event) => {
      offset.set(withTiming(0, { duration: event?.duration || DEFAULT_DURATION_MS }));
    });
    return () => {
      show.remove();
      hide.remove();
      offset.set(0);
    };
  }, [enabled, offset]);

  return offset;
};
