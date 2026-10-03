import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  heroImageContainer: {
    width: "55%",
    maxWidth: 200,
    aspectRatio: 1,
    marginBottom: spacing.lg,
  },
  heroImageContainerTablet: {
    width: "50%",
    maxWidth: 260,
  },
  heroImageContainerLargeTablet: {
    width: "40%",
    maxWidth: 320,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});
