import React, { useEffect } from "react";
import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useReducedMotion,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useKeyboardOffset } from "@/src/core/hooks/useKeyboardOffset";
import { colors } from "@/src/theme/colors";
import { MAX_CONTENT_WIDTH, radii, spacing } from "@/src/theme/spacing";

type SandSheetProps = {
  visible: boolean;
  /** Called when the player closes the sheet (backdrop tap or Android back). */
  onDismiss?: () => void;
  /** Allows closing by tapping the backdrop or pressing back. */
  dismissible?: boolean;
  /** Use inside sheets with a text field so the keyboard pushes the sheet up. */
  withKeyboard?: boolean;
  /** For content that can be taller than the screen (e.g. the rules): caps the height and scrolls. */
  scrollable?: boolean;
  children: React.ReactNode;
};

const MAX_HEIGHT_RATIO = 0.88;
// Short, bounce-free motion: quick to read, never wobbly.
const sheetIn = SlideInDown.duration(220).easing(Easing.out(Easing.cubic));
const sheetOut = SlideOutDown.duration(160).easing(Easing.in(Easing.cubic));
const backdropIn = FadeIn.duration(150);
const backdropOut = FadeOut.duration(150);

/**
 * Sand-colored bottom sheet used for bets, rules, settings and the name form.
 *
 * Rendered as an overlay inside the screen (render it last in the screen's tree) rather than in
 * a native Modal window: on Android edge-to-edge the Modal window stops above the navigation
 * bar, while the screen itself already covers the whole display.
 */
export const SandSheet: React.FC<SandSheetProps> = ({
  visible,
  onDismiss,
  dismissible = true,
  withKeyboard = false,
  scrollable = false,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const keyboardOffset = useKeyboardOffset(withKeyboard && visible);
  // Lift the sheet above the keyboard; its bottom inset is covered by the keyboard meanwhile.
  const liftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -Math.max(0, keyboardOffset.get() - insets.bottom) }],
  }));

  // Android back closes the sheet; a non-dismissible sheet swallows it so the game isn't left.
  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (dismissible) onDismiss?.();
      return true;
    });
    return () => subscription.remove();
  }, [visible, dismissible, onDismiss]);

  if (!visible) return null;

  const close = () => {
    if (dismissible) onDismiss?.();
  };
  const contentStyle = [styles.content, { paddingBottom: insets.bottom + spacing.lg }];

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View
        entering={reduceMotion ? undefined : backdropIn}
        exiting={reduceMotion ? undefined : backdropOut}
        style={styles.backdrop}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={close}
          accessible={false}
          importantForAccessibility="no"
        />
      </Animated.View>
      <Animated.View style={[styles.lift, liftStyle]}>
        <Animated.View
          entering={reduceMotion ? undefined : sheetIn}
          exiting={reduceMotion ? undefined : sheetOut}
          style={[styles.sheet, { maxHeight: height * MAX_HEIGHT_RATIO }]}
          accessibilityViewIsModal
        >
          <View style={styles.handle} />
          {scrollable ? (
            <ScrollView contentContainerStyle={contentStyle} bounces={false}>
              {children}
            </ScrollView>
          ) : (
            <View style={contentStyle}>{children}</View>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
    zIndex: 100,
    elevation: 100,
  },
  lift: { width: "100%" },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(4, 22, 24, 0.55)",
  },
  sheet: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH + 40,
    alignSelf: "center",
    backgroundColor: colors.sand,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    marginTop: 10,
    backgroundColor: "rgba(13, 59, 62, 0.25)",
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: 18,
  },
});
