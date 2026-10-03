import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LanguageProvider } from "@/src/core/context/LanguageContext";
import { SoundProvider } from "@/src/core/context/SoundContext";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function RootLayout() {
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View style={{ flex: 1, opacity }}>
          <BottomSheetModalProvider>
            <LanguageProvider>
              <SoundProvider>
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false }} />
              </SoundProvider>
            </LanguageProvider>
          </BottomSheetModalProvider>
        </Animated.View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
