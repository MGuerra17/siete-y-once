import { ScreenContainer } from "@/src/core/components/ScreenContainer/ScreenContainer";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { StartGameButton } from "../../components/StartGameButton/StartGameButton";
import { styles } from "./HomeScreen.styles";
import type { HomeScreenProps } from "./HomeScreen.types";

export const HomeScreen: React.FC<HomeScreenProps> = ({
  startLabel,
  modeOnlineLabel,
  modeOfflineLabel,
  modeOfflineDescription,
  modeOnlineDescription,
  comingSoonLabel,
  onStart,
  onOpenConfig,
  selectedMode,
  onSelectMode,
}) => {
  const isOfflineSelected = selectedMode === "offline";

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.backgroundLayer} pointerEvents="none">
          <View style={[styles.backgroundCircle, styles.backgroundCircle1]} />
          <View style={[styles.backgroundCircle, styles.backgroundCircle2]} />
          <View style={[styles.backgroundCircle, styles.backgroundCircle3]} />
          <View style={[styles.backgroundCircle, styles.backgroundCircle4]} />
        </View>
        <BlurView
          intensity={100}
          tint="dark"
          pointerEvents="none"
          style={styles.blurLayer}
        />
        <View style={styles.contentLayer}>
          <View style={styles.header}>
            <Pressable
              onPress={onOpenConfig}
              style={({ pressed }) => [
                styles.configButton,
                pressed && styles.configButtonPressed,
              ]}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/seven-eleven-logo.png")}
                style={styles.logo}
                contentFit="contain"
              />
            </View>

            <View style={styles.modeSelector}>
              <View style={styles.modeRow}>
                <Pressable
                  onPress={() => onSelectMode("offline")}
                  style={[
                    styles.modeCard,
                    isOfflineSelected && styles.modeCardActive,
                  ]}
                >
                  <View
                    style={[
                      styles.modeCardIconWrapper,
                      isOfflineSelected && styles.modeCardIconWrapperActive,
                    ]}
                  >
                    <Ionicons
                      name="phone-portrait-outline"
                      size={24}
                      color={
                        isOfflineSelected ? colors.primary : colors.textPrimary
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.modeLabel,
                      isOfflineSelected && styles.modeLabelActive,
                    ]}
                  >
                    {modeOfflineLabel}
                  </Text>
                  <Text
                    style={[
                      styles.modeDescription,
                      isOfflineSelected && styles.modeDescriptionActive,
                    ]}
                  >
                    {modeOfflineDescription}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {}}
                  style={[styles.modeCard, styles.modeCardDisabled]}
                  disabled
                >
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>{comingSoonLabel}</Text>
                  </View>
                  <View style={styles.modeCardIconWrapperDisabled}>
                    <Ionicons
                      name="globe-outline"
                      size={24}
                      color={colors.textSecondary}
                    />
                  </View>
                  <Text style={[styles.modeLabel, styles.modeLabelDisabled]}>
                    {modeOnlineLabel}
                  </Text>
                  <Text
                    style={[
                      styles.modeDescription,
                      styles.modeDescriptionDisabled,
                    ]}
                  >
                    {modeOnlineDescription}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.startButton}>
              <StartGameButton label={startLabel} onPress={onStart} />
            </View>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};
