import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AmbientBackground } from "@/src/core/components/AmbientBackground/AmbientBackground";
import { ModeCard } from "@/src/features/home/components/ModeCard/ModeCard";
import { styles } from "@/src/features/home/screens/HomeScreen/HomeScreen.styles";
import type { HomeScreenProps } from "@/src/features/home/screens/HomeScreen/HomeScreen.types";

export const HomeScreen: React.FC<HomeScreenProps> = ({
  modeOnlineLabel,
  modeOfflineLabel,
  modeOfflineDescription,
  modeOnlineDescription,
  configLabel,
  onOfflinePress,
  onOnlinePress,
  onOpenConfig,
  isNavigating,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isTablet = width >= 600;
  const isLargeTablet = width >= 840;

  return (
    <View style={styles.wrapper}>
      <AmbientBackground />
      <View
        style={[
          styles.container,
          styles.contentWrapper,
          isTablet && styles.contentWrapperTablet,
          { paddingTop: insets.top },
        ]}
      >
        <View
          style={[
            styles.contentLayer,
            isTablet && styles.contentLayerTablet,
            isLargeTablet && styles.contentLayerLargeTablet,
          ]}
        >
          <View style={styles.header}>
            <Pressable
              onPress={onOpenConfig}
              accessibilityRole="button"
              accessibilityLabel={configLabel}
              style={({ pressed }) => [
                styles.configButton,
                isTablet && styles.configButtonTablet,
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
            <View
              style={[
                styles.logoContainer,
                isTablet && styles.logoContainerTablet,
                isLargeTablet && styles.logoContainerLargeTablet,
              ]}
            >
              <Image
                source={require("@/assets/images/seven-eleven-logo.png")}
                style={styles.logo}
                contentFit="contain"
              />
            </View>

            <View
              style={[
                styles.modeSelector,
                isTablet && styles.modeSelectorTablet,
                isLargeTablet && styles.modeSelectorLargeTablet,
              ]}
            >
              <View
                style={[
                  styles.modeRow,
                  isTablet && styles.modeRowTablet,
                ]}
              >
                <ModeCard
                  icon="globe-outline"
                  label={modeOnlineLabel}
                  description={modeOnlineDescription}
                  onPress={onOnlinePress}
                  disabled={isNavigating}
                  isTablet={isTablet}
                  isLargeTablet={isLargeTablet}
                />
                <ModeCard
                  icon="phone-portrait-outline"
                  label={modeOfflineLabel}
                  description={modeOfflineDescription}
                  onPress={onOfflinePress}
                  disabled={isNavigating}
                  isTablet={isTablet}
                  isLargeTablet={isLargeTablet}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
