import { useWindowDimensions } from "react-native";

/** Width breakpoints used to adapt layouts for tablets. */
export const useBreakpoints = () => {
  const { width } = useWindowDimensions();
  return { isTablet: width >= 600, isLargeTablet: width >= 840 };
};
