import type { ViewStyle } from "react-native";

/** Elevation presets (iOS shadow + Android elevation). */
export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
  coral: {
    shadowColor: "#F2694B",
    shadowOpacity: 0.38,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} satisfies Record<string, ViewStyle>;
