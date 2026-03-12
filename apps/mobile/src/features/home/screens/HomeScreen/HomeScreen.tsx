import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModeCard } from "@/src/features/home/components/ModeCard/ModeCard";
import { styles } from "@/src/features/home/screens/HomeScreen/HomeScreen.styles";
import type { HomeScreenProps } from "@/src/features/home/screens/HomeScreen/HomeScreen.types";

export const HomeScreen: React.FC<HomeScreenProps> = ({
  modeOnlineLabel,
  modeOfflineLabel,
  modeOfflineDescription,
  modeOnlineDescription,
  onOfflinePress,
  onOnlinePress,
  onOpenConfig,
  isNavigating,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrapper}>
      {Platform.OS !== "android" && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <View style={styles.backgroundLayer}>
            <View style={[styles.backgroundCircle, styles.backgroundCircle1]} />
            <View style={[styles.backgroundCircle, styles.backgroundCircle2]} />
            <View style={[styles.backgroundCircle, styles.backgroundCircle3]} />
            <View style={[styles.backgroundCircle, styles.backgroundCircle4]} />
          </View>
          <BlurView
            intensity={100}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            pointerEvents="none"
            style={styles.blurLayer}
          />
        </View>
      )}
      <View
        style={[
          styles.container,
          styles.contentWrapper,
          { paddingTop: insets.top },
        ]}
      >
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
                <ModeCard
                  icon="globe-outline"
                  label={modeOnlineLabel}
                  description={modeOnlineDescription}
                  onPress={onOnlinePress}
                  disabled={isNavigating}
                />
                <ModeCard
                  icon="phone-portrait-outline"
                  label={modeOfflineLabel}
                  description={modeOfflineDescription}
                  onPress={onOfflinePress}
                  disabled={isNavigating}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
