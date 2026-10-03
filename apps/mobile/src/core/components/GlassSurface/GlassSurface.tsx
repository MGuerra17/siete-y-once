import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { colors } from "@/src/theme/colors";

type GlassSurfaceProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  /** Darker tint for surfaces over busy imagery (game table). */
  strong?: boolean;
  children?: React.ReactNode;
};

/**
 * Frosted translucent surface: a blur of what is behind, tinted with the sea color
 * and outlined with a hairline. On Android without blur support the tint alone keeps
 * text readable.
 */
export const GlassSurface: React.FC<GlassSurfaceProps> = ({ style, strong, children, ...rest }) => (
  <View {...rest} style={[styles.base, style]}>
    <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: strong ? colors.glassStrong : colors.glass }]}
      pointerEvents="none"
    />
    {children}
  </View>
);

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.glassBorder,
  },
});
