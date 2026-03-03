import { AppText } from "@/src/core/components/AppText/AppText";
import React from "react";
import { View } from "react-native";
import { styles } from "@/src/features/game/components/DiceSumDisplay/DiceSumDisplay.styles";
import { DiceSumDisplayProps } from "@/src/features/game/components/DiceSumDisplay/DiceSumDisplay.types";

export const DiceSumDisplay: React.FC<DiceSumDisplayProps> = ({
  label,
  value,
  invertOrder = false,
  visible = false,
}) => {
  if (!visible) {
    return null;
  }

  const displayValue = value !== undefined && value !== null ? value : "—";

  const labelEl = (
    <AppText variant="label" align="center">
      {label}
    </AppText>
  );
  const valueEl = (
    <AppText variant="title" align="center">
      {displayValue}
    </AppText>
  );

  return (
    <View style={styles.container}>
      {invertOrder ? (
        <>
          {valueEl}
          {labelEl}
        </>
      ) : (
        <>
          {labelEl}
          {valueEl}
        </>
      )}
    </View>
  );
};
