import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/theme/colors";
import { MAX_CONTENT_WIDTH, radii, spacing } from "@/src/theme/spacing";

type SandSheetProps = {
  visible: boolean;
  onDismiss?: () => void;
  /** Allows closing by dragging down or tapping the backdrop. */
  dismissible?: boolean;
  /** Use inside sheets with a text field so the keyboard pushes the sheet up. */
  withKeyboard?: boolean;
  children: React.ReactNode;
};

/** Sand-colored bottom sheet used for bets, rules, settings and the name form. */
export const SandSheet: React.FC<SandSheetProps> = ({
  visible,
  onDismiss,
  dismissible = true,
  withKeyboard = false,
  children,
}) => {
  const ref = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) ref.current?.present();
    else ref.current?.dismiss();
  }, [visible]);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.55}
      pressBehavior={dismissible ? "close" : "none"}
    />
  );

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={dismissible}
      onDismiss={onDismiss}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.background}
      style={styles.sheet}
      keyboardBehavior={withKeyboard ? "interactive" : undefined}
      keyboardBlurBehavior={withKeyboard ? "restore" : undefined}
    >
      <BottomSheetView style={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    maxWidth: MAX_CONTENT_WIDTH + 40,
    width: "100%",
    alignSelf: "center",
  },
  background: {
    backgroundColor: colors.sand,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
  },
  handle: {
    width: 40,
    backgroundColor: "rgba(13, 59, 62, 0.25)",
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    gap: 18,
  },
});
