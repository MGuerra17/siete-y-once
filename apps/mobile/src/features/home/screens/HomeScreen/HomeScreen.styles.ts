import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
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
  modeCard: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.sm,
    borderRadius: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 120,
  },
  modeCardActive: {
    backgroundColor: colors.primary + "40",
    borderColor: colors.primary,
  },
  modeCardDisabled: {
    opacity: 0.7,
  },
  modeCardIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  modeCardIconWrapperActive: {
    backgroundColor: colors.primary,
  },
  modeCardIconWrapperDisabled: {
    backgroundColor: colors.border,
  },
  modeLabel: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  modeLabelActive: {
    color: colors.textPrimary,
  },
  modeLabelDisabled: {
    color: colors.textSecondary,
  },
  modeDescription: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: spacing.xs,
  },
  modeDescriptionActive: {
    color: colors.textSecondary,
  },
  modeDescriptionDisabled: {
    color: colors.textSecondary,
  },
  comingSoonBadge: {
    position: "absolute",
    top: -spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  comingSoonText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.background,
  },
  startButton: {
    marginTop: spacing.xxl,
    width: "100%",
    alignSelf: "stretch",
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
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
  backgroundCircle: {
    position: "absolute",
  },
  backgroundCircleTablet: {
  },
  backgroundCircle1: {
    top: "10%",
    left: "-10%",
    width: 120,
    height: 120,
  },
  backgroundCircle2: {
    top: "25%",
    right: "-15%",
    width: 110,
    height: 110,
  },
  backgroundCircle3: {
    bottom: "20%",
    left: "-5%",
    width: 100,
    height: 100,
  },
  backgroundCircle4: {
    bottom: "35%",
    right: "-8%",
    width: 90,
    height: 90,
  },
  backgroundCircle1Tablet: {
    left: "-4%",
    width: 190,
    height: 190,
  },
  backgroundCircle2Tablet: {
    right: "-4%",
    width: 180,
    height: 180,
  },
  backgroundCircle3Tablet: {
    left: "0%",
    width: 170,
    height: 170,
  },
  backgroundCircle4Tablet: {
    right: "0%",
    width: 160,
    height: 160,
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
  modeCardTablet: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    minHeight: 140,
  },
  modeCardLargeTablet: {
    minHeight: 160,
  },
  modeLabelTablet: {
    fontSize: fontSize.lg,
  },
  modeDescriptionTablet: {
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  configButtonTablet: {
    padding: spacing.md,
  },
});
