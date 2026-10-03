import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { GlassSurface } from "@/src/core/components/GlassSurface/GlassSurface";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { colors } from "@/src/theme/colors";
import { fonts } from "@/src/theme/typography";

type NamePillProps = { name: string; onPress: () => void };

/** "Playing as Ana ✎" — tapping it edits the name. */
export const NamePill: React.FC<NamePillProps> = ({ name, onPress }) => {
  const { t } = useLanguage();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${t("online.lobby.playingAs")} ${name}. ${t("online.username.title")}`}
      hitSlop={4}
    >
      <GlassSurface style={styles.pill}>
        <Text style={styles.text} numberOfLines={1}>
          {t("online.lobby.playingAs")} <Text style={styles.name}>{name}</Text>
        </Text>
        <Ionicons name="pencil" size={13} color={colors.textPrimary} />
      </GlassSurface>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    height: 40,
    maxWidth: 230,
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.textPrimary, flexShrink: 1 },
  name: { fontFamily: fonts.bodyBold },
});
