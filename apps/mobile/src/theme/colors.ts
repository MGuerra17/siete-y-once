/** "Mesa Costeña" palette. Names describe the role; comments name the swatch. */
export const colors = {
  /** Mar profundo: app background, text on sand and sun. */
  background: "#0D3B3E",
  backgroundDeep: "#09282A",
  /** Paño: felt green. */
  felt: "#135E5A",
  /** Arena: light surfaces (player card, sheets). */
  sand: "#F3E3C3",
  /** Coral: primary actions. */
  coral: "#F2694B",
  /** Sol: accents, highlights, secondary actions. */
  sun: "#F6B93B",
  ivory: "#FFF8EA",
  ivoryWarm: "#FFF1D6",
  diceFace: "#FFF1D6",
  diceFaceAlt: "#FFF6E4",
  textPrimary: "#F3E3C3",
  textStrong: "#FFF8EA",
  textSecondary: "#CFE3DC",
  textMuted: "#9FC2B8",
  textOnSand: "#0D3B3E",
  textOnSandMuted: "#33605F",
  textOnCoral: "#FFF8EA",
  divider: "#22585A",
  online: "#2FA36B",
  danger: "#E5533A",
  glass: "rgba(13, 59, 62, 0.42)",
  glassStrong: "rgba(9, 40, 42, 0.55)",
  glassBorder: "rgba(243, 227, 195, 0.25)",
  sandBorder: "rgba(13, 59, 62, 0.25)",
  scrim: "rgba(6, 28, 30, 0.55)",
} as const;

export type ColorKey = keyof typeof colors;
