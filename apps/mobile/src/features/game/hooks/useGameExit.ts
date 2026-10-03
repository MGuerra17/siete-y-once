import { useRouter } from "expo-router";
import { useCallback } from "react";

/** Navigates back to the home screen, whatever the navigation history looks like. */
export const useGoHome = () => {
  const router = useRouter();
  return useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, [router]);
};
