import type { ImageSource } from "expo-image";
import type React from "react";

export type PosterScreenProps = {
  /** Vertical 9:16 illustration drawn edge to edge from the top of the screen. */
  source: ImageSource | number;
  /** Shifts the illustration up (negative) to frame a different part of it. */
  imageOffset?: number;
  /** Fraction of the screen height where the fade into the background starts. */
  fadeStart?: number;
  /** Small uppercase line above the title. */
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  titleSize?: "hero" | "title";
  /** Buttons pinned to the top corners. */
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  /** Bottom-anchored content (actions, cards). */
  children?: React.ReactNode;
  testID?: string;
};
