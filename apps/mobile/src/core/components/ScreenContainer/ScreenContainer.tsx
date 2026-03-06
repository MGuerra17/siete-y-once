import React from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "@/src/core/components/ScreenContainer/ScreenContainer.styles";

type ScreenContainerProps = ViewProps & {
  children: React.ReactNode;
};

/** Full-screen wrapper with background color. Safe area only on top (status bar). */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  ...rest
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.safeArea}>
      <View
        style={[styles.container, { paddingTop: insets.top }, style]}
        {...rest}
      >
        {children}
      </View>
    </View>
  );
};
