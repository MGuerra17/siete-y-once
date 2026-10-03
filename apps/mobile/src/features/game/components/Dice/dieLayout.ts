/**
 * Pip centers for each face as fractions of the die size, matching the brand die
 * (corners at 27 % / 73 %, middle at 50 %).
 */
const A = 0.27;
const B = 0.5;
const C = 0.73;

export const PIP_LAYOUTS: Record<number, readonly (readonly [number, number])[]> = {
  1: [[B, B]],
  2: [[A, A], [C, C]],
  3: [[A, A], [B, B], [C, C]],
  4: [[A, A], [C, A], [A, C], [C, C]],
  5: [[A, A], [C, A], [B, B], [A, C], [C, C]],
  6: [[A, A], [C, A], [A, B], [C, B], [A, C], [C, C]],
};

/** Pip diameter relative to the die. */
export const PIP_RATIO = 0.17;

/** Absolute pip boxes for a die of `size` showing `value` (clamped to 1..6). */
export function pipBoxes(value: number, size: number) {
  const face = Math.min(6, Math.max(1, Math.round(value)));
  const diameter = Math.round(size * PIP_RATIO);
  return PIP_LAYOUTS[face]!.map(([x, y]) => ({
    left: x * size - diameter / 2,
    top: y * size - diameter / 2,
    size: diameter,
  }));
}
