import React from "react";
import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { styles } from "@/src/core/components/Avatar/Avatar.styles";
import { AvatarProps } from "@/src/core/components/Avatar/Avatar.types";

/** Circular avatar with image or person-icon fallback. Highlights when `isActive` is true. */
export const Avatar: React.FC<AvatarProps> = ({
  imageUri,
  isActive = false,
  size = 56,
  fallbackLabel = "?",
}) => {
  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    isActive ? styles.activeBorder : styles.inactiveBorder,
  ];

  return (
    <View style={containerStyle}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: size / 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, { borderRadius: size / 2 }]}>
          <Ionicons
            name="person"
            size={size * 0.5}
            color={colors.textSecondary}
          />
        </View>
      )}
    </View>
  );
};

