import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";

/**
 * Exit-confirmation dialog state, also bound to the Android back button.
 * `onCancel` runs when the dialog is dismissed without leaving (e.g. to resume a timer).
 */
export const useExitConfirm = (onConfirm: () => void, onCancel?: () => void) => {
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => {
    setIsVisible(false);
    onCancel?.();
  }, [onCancel]);
  const confirm = useCallback(() => {
    setIsVisible(false);
    onConfirm();
  }, [onConfirm]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (isVisible) hide();
      else show();
      return true;
    });
    return () => subscription.remove();
  }, [isVisible, show, hide]);

  return { isVisible, show, hide, confirm };
};
