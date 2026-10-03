import type { TextStyle } from "react-native";

/**
 * Font families loaded in the root layout. Weights live in the family name because
 * custom fonts ignore `fontWeight` on Android.
 */
export const fonts = {
  display: "BricolageGrotesque_800ExtraBold",
  displayBold: "BricolageGrotesque_700Bold",
  displayMedium: "BricolageGrotesque_500Medium",
  body: "Figtree_400Regular",
  bodyMedium: "Figtree_500Medium",
  bodySemiBold: "Figtree_600SemiBold",
  bodyBold: "Figtree_700Bold",
} as const;

/** Type scale used by AppText variants and the few hand-styled texts. */
export const typography = {
  hero: { fontFamily: fonts.display, fontSize: 56, lineHeight: 54, letterSpacing: -1.3 },
  title: { fontFamily: fonts.display, fontSize: 40, lineHeight: 40, letterSpacing: -0.8 },
  heading: { fontFamily: fonts.display, fontSize: 22, lineHeight: 26 },
  figure: { fontFamily: fonts.displayBold, fontSize: 20, lineHeight: 24 },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 22 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 14, lineHeight: 18 },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: fonts.display, fontSize: 19, lineHeight: 24 },
} satisfies Record<string, TextStyle>;

export type TypographyKey = keyof typeof typography;
