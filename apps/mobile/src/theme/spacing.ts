export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
} as const;

export type SpacingKey = keyof typeof spacing;

export const radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  sheet: 32,
  pill: 999,
} as const;

/** Content never grows wider than this on tablets; it is centered instead. */
export const MAX_CONTENT_WIDTH = 480;

/** Minimum touch target (Apple HIG / Material). */
export const MIN_TOUCH = 44;
