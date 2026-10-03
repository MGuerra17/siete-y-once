import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontSize";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  containerTablet: {
    paddingHorizontal: spacing.xl,
  },
  containerLargeTablet: {
    paddingHorizontal: spacing.xxl,
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: spacing.xxl,
    alignItems: "center",
  },
  scrollContentTablet: {
    paddingBottom: spacing.xxl + spacing.lg,
  },
  errorContainer: {
    backgroundColor: colors.danger + "20",
    borderRadius: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    width: "100%",
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  createGameButton: {
    alignSelf: "center",
  },
  createGameButtonTablet: {
    width: "100%",
    maxWidth: 480,
  },
});
