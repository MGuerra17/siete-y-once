import type React from "react";
import type { TextProps } from "react-native";
import type { TypographyKey } from "@/src/theme/typography";

export type AppTextVariant = TypographyKey;

/** Text color roles: `light` on dark/illustrated backgrounds, `dark` on sand surfaces. */
export type AppTextTone = "light" | "strong" | "muted" | "soft" | "dark" | "darkMuted" | "sun" | "coral";

export type AppTextProps = TextProps & {
  children: React.ReactNode;
  variant?: AppTextVariant;
  tone?: AppTextTone;
  align?: "left" | "center" | "right";
};
