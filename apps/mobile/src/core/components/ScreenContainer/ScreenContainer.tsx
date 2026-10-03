import React from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "@/src/core/components/ScreenContainer/ScreenContainer.styles";

type ScreenContainerProps = ViewProps & {
  children?: React.ReactNode;
  /** Also pad the bottom safe area (home indicator / gesture bar). */
  withBottomInset?: boolean;
};

/** Full-screen wrapper with background color. Pads the top safe area, and the bottom one on demand. */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  withBottomInset = false,
  ...rest
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.safeArea}>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: withBottomInset ? insets.bottom : 0 },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </View>
  );
};
