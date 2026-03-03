import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { styles } from "./GameToast.styles";
import type { GameToastProps } from "./GameToast.types";

const DEFAULT_DURATION = 3000;

export const GameToast: React.FC<GameToastProps> = ({
  message,
  duration = DEFAULT_DURATION,
  onDismiss,
}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!message || message.trim() === "") {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      onDismiss?.();
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [message, duration, onDismiss]);

  if (!message || message.trim() === "") {
    return null;
  }

  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
      accessibilityLabel={message}
      accessibilityRole="alert"
    >
      <View style={styles.pill}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};
