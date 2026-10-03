import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { MAX_CONTENT_WIDTH, spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    left: 0,
  },
  topScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
  },
  topBar: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sky: {
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  title: {
    textAlign: "center",
    textShadowColor: "rgba(13, 59, 62, 0.45)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 18,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    gap: spacing.md,
  },
});
