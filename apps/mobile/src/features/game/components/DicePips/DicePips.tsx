import React from "react";
import { View } from "react-native";
import { PIP_CONFIG } from "@/src/features/game/constants/dicePips.constants";
import { styles } from "@/src/features/game/components/DicePips/DicePips.styles";
import type { DicePipsProps } from "@/src/features/game/components/DicePips/DicePips.types";

/** Renders the pip dots for a given dice face value (1-6). */
export const DicePips: React.FC<DicePipsProps> = ({ value }) => {
  const clamped = Math.min(Math.max(value, 1), 6);
  const grid = PIP_CONFIG[clamped];

  return (
    <View style={styles.pipsContainer}>
      {[0, 1, 2].map((col) => (
        <View key={col} style={styles.pipColumn}>
          {[0, 1, 2].map((row) => (
            <View
              key={row}
              style={[styles.pip, !grid[row][col] && styles.pipTransparent]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};
