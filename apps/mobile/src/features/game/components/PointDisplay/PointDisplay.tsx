import React from "react";
import { View } from "react-native";
import { AppText } from "@/src/core/components/AppText/AppText";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { styles } from "@/src/features/game/components/PointDisplay/PointDisplay.styles";
import type { PointDisplayProps } from "@/src/features/game/components/PointDisplay/PointDisplay.types";

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

