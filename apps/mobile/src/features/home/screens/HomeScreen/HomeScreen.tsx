import React from "react";
import { Pressable, View, Text } from "react-native";
import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import { AppText } from "@/src/core/components/AppText/AppText";
import { StartGameButton } from "../../components/StartGameButton/StartGameButton";
import type { Language } from "@/src/core/i18n/translations";
import { styles } from "./HomeScreen.styles";
import { HomeScreenProps } from "./HomeScreen.types";

const isActiveLanguage = (current: Language, target: Language) =>
  current === target;

export const HomeScreen: React.FC<HomeScreenProps> = ({
  title,
  startLabel,
  language,
  englishLabel,
  spanishLabel,
  onStart,
  onSelectLanguage,
}) => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.title}>
          <AppText variant="title" align="center">
            {title}
          </AppText>
        </View>

        <View style={styles.startButton}>
          <StartGameButton label={startLabel} onPress={onStart} />
        </View>

        <View style={styles.languageRow}>
          <View style={styles.languageToggle}>
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
                  isActiveLanguage(language, "en") &&
                    styles.languageButtonTextActive,
                ]}
              >
                {englishLabel}
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
                  isActiveLanguage(language, "es") &&
                    styles.languageButtonTextActive,
                ]}
              >
                {spanishLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

