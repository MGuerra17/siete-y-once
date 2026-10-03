import React from "react";
import { Text } from "react-native";
import { toneColors, variantStyles } from "@/src/core/components/AppText/AppText.styles";
import type { AppTextProps } from "@/src/core/components/AppText/AppText.types";

/** Text in the app's type scale (Bricolage Grotesque for display, Figtree for UI). */
export const AppText: React.FC<AppTextProps> = ({
  children,
  variant = "body",
  tone = "light",
  align,
  style,
  ...rest
}) => (
  <Text
    {...rest}
    style={[variantStyles[variant], { color: toneColors[tone] }, align && { textAlign: align }, style]}
  >
    {children}
  </Text>
);
