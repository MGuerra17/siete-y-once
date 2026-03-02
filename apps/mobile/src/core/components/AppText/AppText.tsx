import React from "react";
import { Text } from "react-native";
import { styles, variantStyles } from "./AppText.styles";
import { AppTextProps } from "./AppText.types";

export const AppText: React.FC<AppTextProps> = ({
  children,
  variant = "body",
  align = "left",
}) => {
  return (
    <Text style={[styles.base, variantStyles[variant], { textAlign: align }]}>
      {children}
    </Text>
  );
};

