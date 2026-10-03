import { SHORT_CODE_LENGTH } from "@seven/protocol";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/typography";

/** The share code as six large tiles, easy to read aloud over the phone. */
export const CodeTiles: React.FC<{ code: string }> = ({ code }) => {
  const { t } = useLanguage();
  const chars = code.padEnd(SHORT_CODE_LENGTH).slice(0, SHORT_CODE_LENGTH).split("");
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="text"
      accessibilityLabel={t("online.waiting.codeA11y", { code: code.split("").join(" ") })}
    >
      {chars.map((char, index) => (
        <View key={index} style={styles.tile}>
          <Text style={styles.char}>{char}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6 },
  tile: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  char: { fontFamily: fonts.display, fontSize: 26, color: colors.sand },
});
