export const colors = {
  background: "#050816",
  surface: "rgba(255, 255, 255, 0.02)",
  primary: "#22c55e",
  primaryMuted: "#15803d",
  border: "#1f2937",
  textPrimary: "#f9fafb",
  textSecondary: "#9ca3af",
  danger: "#ef4444",
  success: "#22c55e",
} as const;

export type ColorKey = keyof typeof colors;
