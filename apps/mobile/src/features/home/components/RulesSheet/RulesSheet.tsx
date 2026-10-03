import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/core/components/AppText/AppText";
import { PrimaryButton } from "@/src/core/components/PrimaryButton/PrimaryButton";
import { SandSheet } from "@/src/core/components/SandSheet/SandSheet";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import type { TranslationKey } from "@/src/core/i18n/translations";
import { colors } from "@/src/theme/colors";

const RULES: readonly TranslationKey[] = [
  "rules.roles",
  "rules.bet",
  "rules.comeOut",
  "rules.point",
  "rules.next",
  "rules.timer",
  "rules.end",
];

type RulesSheetProps = {
  visible: boolean;
  onClose: () => void;
};

/** "How to play": the rules in seven short, numbered steps. */
export const RulesSheet: React.FC<RulesSheetProps> = ({ visible, onClose }) => {
  const { t } = useLanguage();
  return (
    <SandSheet visible={visible} onDismiss={onClose}>
      <View style={styles.header}>
        <AppText variant="heading" tone="dark" accessibilityRole="header">
          {t("rules.title")}
        </AppText>
        <AppText variant="caption" tone="darkMuted">
          {t("rules.intro")}
        </AppText>
      </View>
      <View style={styles.list}>
        {RULES.map((key, index) => (
          <View key={key} style={styles.item}>
            <View style={styles.number}>
              <AppText variant="label" style={styles.numberText}>
                {index + 1}
              </AppText>
            </View>
            <AppText variant="caption" tone="dark" style={styles.itemText}>
              {t(key)}
            </AppText>
          </View>
        ))}
      </View>
      <PrimaryButton label={t("rules.cta")} onPress={onClose} />
    </SandSheet>
  );
};

const styles = StyleSheet.create({
  header: { gap: 4 },
  list: { gap: 10 },
  item: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  number: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  numberText: { color: colors.sand, fontSize: 12, lineHeight: 14 },
  itemText: { flex: 1, fontSize: 14, lineHeight: 20 },
});
