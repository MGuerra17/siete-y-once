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

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <LanguageProvider>
            <SoundProvider>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false }} />
            </SoundProvider>
          </LanguageProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
