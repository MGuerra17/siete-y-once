import type React from "react";
import type { TextProps } from "react-native";

export type AppTextVariant = "title" | "subtitle" | "body" | "label";

export type AppTextProps = TextProps & {
  children: React.ReactNode;
  variant?: AppTextVariant;
  align?: "left" | "center" | "right";
};

