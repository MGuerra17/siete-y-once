import React from "react";
import { Text } from "react-native";
import { styles, variantStyles } from "@/src/core/components/AppText/AppText.styles";
import { AppTextProps } from "@/src/core/components/AppText/AppText.types";

/** Themed text component with variant-based styling (title, body, label, caption). */
export const AppText: React.FC<AppTextProps> = ({
  children,
  variant = "body",
  align = "left",
  style,
  ...rest
}) => {
  return (
    <Text
      {...rest}
      style={[styles.base, variantStyles[variant], { textAlign: align }, style]}
    >
      {children}
    </Text>
  );
};

