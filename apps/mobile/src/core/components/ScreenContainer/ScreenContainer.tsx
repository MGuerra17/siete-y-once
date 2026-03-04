import React from "react";
import { SafeAreaView, ViewProps } from "react-native";
import { styles } from "@/src/core/components/ScreenContainer/ScreenContainer.styles";

type ScreenContainerProps = ViewProps & {
  children: React.ReactNode;
};

/** Full-screen safe-area wrapper with the app's background color. */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SafeAreaView style={styles.background}>
        <SafeAreaView style={[styles.container, style]} {...rest}>
          {children}
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

