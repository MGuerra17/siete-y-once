import React from "react";
import { View } from "react-native";
import { AppText } from "@/src/core/components/AppText/AppText";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { styles } from "./PointDisplay.styles";

type PointDisplayProps = {
  point: number;
};

export const PointDisplay: React.FC<PointDisplayProps> = ({ point }) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <AppText variant="label" align="center">
        {t("game.pointLabel")}
      </AppText>
      <AppText variant="title" align="center">
        {point}
      </AppText>
    </View>
  );
};

