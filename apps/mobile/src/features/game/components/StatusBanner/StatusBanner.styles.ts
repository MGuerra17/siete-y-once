import { StyleSheet } from "react-native";
import { styles as toastStyles } from "@/src/features/game/components/GameToast/GameToast.styles";
import { spacing } from "@/src/theme/spacing";

export const styles = StyleSheet.create({
  container: {
    ...toastStyles.container,
    top: undefined,
    bottom: "50%",
    marginBottom: spacing.xxl * 2,
  },
  pill: toastStyles.pill,
  text: toastStyles.text,
});
