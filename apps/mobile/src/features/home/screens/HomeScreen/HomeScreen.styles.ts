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
    width: "80%",
    aspectRatio: 1,
    maxWidth: 280,
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
    backgroundColor: colors.surface + "cc",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 120,
  },
  modeCardActive: {
    backgroundColor: colors.primary + "20",
    borderColor: colors.primary,
  },
  modeCardDisabled: {
    opacity: 0.7,
  },
  modeCardIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border + "80",
    alignItems: "center",
    justifyContent: "center",
  },
  modeCardIconWrapperActive: {
    backgroundColor: colors.primary + "40",
  },
  modeCardIconWrapperDisabled: {
    backgroundColor: colors.border + "50",
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
    color: colors.textSecondary + "cc",
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
  backgroundCircle: {
    position: "absolute",
    opacity: 0.4,
  },
  backgroundCircle1: {
    top: "10%",
    left: "-10%",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
  },
  backgroundCircle2: {
    top: "25%",
    right: "-15%",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
  },
  backgroundCircle3: {
    bottom: "20%",
    left: "-5%",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
  },
  backgroundCircle4: {
    bottom: "35%",
    right: "-8%",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
  },
});
