import { useRouter } from "expo-router";
import { useCallback } from "react";

/**
 * Navigates to the home screen whatever the history looks like: pops back to it when it is
 * in the stack, or replaces the current route when the app was opened straight on a game
 * (deep link, dev reload, resumed session).
 */
export const useGoHome = () => {
  const router = useRouter();
  return useCallback(() => {
    if (router.canDismiss()) router.dismissTo("/");
    else router.replace("/");
  }, [router]);
};
