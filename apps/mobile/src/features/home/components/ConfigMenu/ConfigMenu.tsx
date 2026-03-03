import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { colors } from "@/src/theme/colors";
import { styles } from "@/src/features/home/components/ConfigMenu/ConfigMenu.styles";
import type { ConfigMenuProps } from "@/src/features/home/components/ConfigMenu/ConfigMenu.types";

const isActiveLanguage = (current: string, target: string) => current === target;

export const ConfigMenu: React.FC<ConfigMenuProps> = ({
  visible,
  onClose,
  language,
  onSelectLanguage,
  soundEnabled,
  onSoundToggle,
}) => {
  const { t } = useLanguage();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (!bottomSheetRef.current) return;

    if (visible) {
      bottomSheetRef.current.present();
    } else {
      bottomSheetRef.current.dismiss();
    }
  }, [visible]);

  const renderBackdrop = (backdropProps: Parameters<typeof BottomSheetBackdrop>[0]) => (
    <BottomSheetBackdrop
      {...backdropProps}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={onClose}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.modal}
      backgroundStyle={styles.background}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t("home.configTitle")}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.sectionTitle}>{t("home.languageLabel")}</Text>
          </View>
          <View style={styles.languageRow}>
            <Pressable
              onPress={() => onSelectLanguage("en")}
              style={[
                styles.languageButton,
                isActiveLanguage(language, "en") && styles.languageButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  isActiveLanguage(language, "en") && styles.languageButtonTextActive,
                ]}
              >
                {t("home.languageEnglish")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onSelectLanguage("es")}
              style={[
                styles.languageButton,
                isActiveLanguage(language, "es") && styles.languageButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  isActiveLanguage(language, "es") && styles.languageButtonTextActive,
                ]}
              >
                {t("home.languageSpanish")}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="volume-high-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.sectionTitle}>{t("home.soundLabel")}</Text>
          </View>
          <View style={styles.soundRow}>
            <Text style={styles.soundLabel}>
              {soundEnabled ? t("home.soundOn") : t("home.soundOff")}
            </Text>
            <Switch
              value={soundEnabled}
              onValueChange={onSoundToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
