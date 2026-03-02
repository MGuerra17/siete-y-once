import React from "react";
import { SafeAreaView, ViewProps } from "react-native";
import { styles } from "./ScreenContainer.styles";

type ScreenContainerProps = ViewProps & {
  children: React.ReactNode;
};

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

