import React from "react";
import { Text, View } from "react-native";
import { styles } from "@/src/features/game/components/WinningNumbersRow/WinningNumbersRow.styles";
import { WinningNumbersRowProps } from "@/src/features/game/components/WinningNumbersRow/WinningNumbersRow.types";

export const WinningNumbersRow: React.FC<WinningNumbersRowProps> = ({
  label,
  numbers,
  align = "left",
}) => {
  const containerStyle = [
    styles.container,
    align === "right" && styles.containerRight,
  ];

  return (
    <View style={containerStyle}>
      <View style={styles.list}>
        {numbers.map((num) => (
          <View key={num} style={styles.pill}>
            <Text style={styles.pillText}>{num}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

