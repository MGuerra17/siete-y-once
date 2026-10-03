import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    position: "relative",
  },
  contentWrapper: {
    flex: 1,
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  configButton: {
    padding: spacing.sm,
    borderRadius: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  configButtonPressed: {
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: "70%",
    aspectRatio: 1,
    maxWidth: 240,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  modeSelector: {
    marginTop: spacing.xxl,
    width: "100%",
    maxWidth: 340,
  },
  modeRow: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
  },
  contentLayer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  contentLayerTablet: {
    paddingHorizontal: spacing.xl,
  },
  contentLayerLargeTablet: {
    paddingHorizontal: spacing.xxl,
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
  contentWrapperTablet: {
    paddingVertical: spacing.xl,
  },
  logoContainerTablet: {
    width: "50%",
    maxWidth: 320,
    marginBottom: spacing.xl,
  },
  logoContainerLargeTablet: {
    width: "40%",
    maxWidth: 380,
  },
  modeSelectorTablet: {
    maxWidth: 480,
  },
  modeSelectorLargeTablet: {
    maxWidth: 640,
  },
  modeRowTablet: {
    gap: spacing.lg,
  },
  configButtonTablet: {
    padding: spacing.md,
  },
});
