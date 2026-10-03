import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { setAudioModeAsync } from "expo-audio";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

export default function RootLayout() {
  const [opacity] = useState(() => new Animated.Value(0.8));

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    // Game sounds mix with the player's music and respect the silent switch.
    setAudioModeAsync({ playsInSilentMode: false, interruptionMode: "mixWithOthers" }).catch(
      () => undefined,
    );
  }, [opacity]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={styles.fill}>
        <Animated.View style={[styles.fill, { opacity }]}>
          <BottomSheetModalProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
          </BottomSheetModalProvider>
        </Animated.View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
