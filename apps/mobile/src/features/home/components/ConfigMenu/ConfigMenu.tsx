import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/core/components/AppText/AppText";
import { SandSheet } from "@/src/core/components/SandSheet/SandSheet";
import { SettingRow } from "@/src/core/components/SettingRow/SettingRow";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import type { Language } from "@/src/core/i18n/translations";
import type { ConfigMenuProps } from "@/src/features/home/components/ConfigMenu/ConfigMenu.types";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/typography";

const LANGUAGES: { value: Language; key: "home.languageSpanish" | "home.languageEnglish" }[] = [
  { value: "es", key: "home.languageSpanish" },
  { value: "en", key: "home.languageEnglish" },
];

/** Settings sheet: language, sound and haptics. */
export const ConfigMenu: React.FC<ConfigMenuProps> = ({
  visible,
  onClose,
  language,
  onSelectLanguage,
  soundEnabled,
  onSoundToggle,
  hapticsEnabled,
  onHapticsToggle,
}) => {
  const { t } = useLanguage();

  return (
    <SandSheet visible={visible} onDismiss={onClose}>
      <AppText variant="heading" tone="dark" accessibilityRole="header">
        {t("home.configTitle")}
      </AppText>

      <View style={styles.section}>
        <AppText variant="label" tone="darkMuted">
          {t("home.languageLabel")}
        </AppText>
        <View style={styles.segmented} accessibilityRole="radiogroup">
          {LANGUAGES.map(({ value, key }) => {
            const selected = value === language;
            return (
              <Pressable
                key={value}
                onPress={() => onSelectLanguage(value)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.segment, selected && styles.segmentSelected]}
              >
                <AppText style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                  {t(key)}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <SettingRow
          icon="volume-high-outline"
          label={t("home.soundLabel")}
          value={soundEnabled}
          onChange={onSoundToggle}
        />
        <SettingRow
          icon="phone-portrait-outline"
          label={t("home.hapticsLabel")}
          value={hapticsEnabled}
          onChange={onHapticsToggle}
        />
      </View>
    </SandSheet>
  );
};

const styles = StyleSheet.create({
  section: { gap: 10 },
  segmented: {
    flexDirection: "row",
    padding: 4,
    gap: 4,
    borderRadius: 16,
    backgroundColor: "rgba(13,59,62,0.08)",
  },
  segment: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentSelected: { backgroundColor: colors.background },
  segmentText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.textOnSand },
  segmentTextSelected: { color: colors.sand },
});
