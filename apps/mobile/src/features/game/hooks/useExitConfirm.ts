import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";

/**
 * Manages exit-confirmation modal state and the Android hardware back button.
 * Pressing back shows the confirm dialog; pressing again hides it.
 */
export const useExitConfirm = (onConfirm: () => void) => {
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);

  const confirm = useCallback(() => {
    setIsVisible(false);
    onConfirm();
  }, [onConfirm]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setIsVisible((prev) => !prev);
        return true;
      },
    );
    return () => subscription.remove();
  }, []);

  return { isVisible, show, hide, confirm };
};
