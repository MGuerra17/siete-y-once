/** Illustrations are 9:16; the fade must end before the picture does. */
const IMAGE_RATIO = 16 / 9;
const MIN_FADE = 160;

export type PosterLayoutInput = {
  width: number;
  height: number;
  imageOffset: number;
  fadeStart: number;
};

/**
 * Where the illustration ends and the fade sits. The fade starts at `fadeStart` of the
 * screen, but never later than the point that still leaves room to blend before the
 * image bottom (tall Android screens are taller than a 9:16 picture).
 */
export function posterLayout({ width, height, imageOffset, fadeStart }: PosterLayoutInput) {
  const imageHeight = Math.round(width * IMAGE_RATIO);
  const imageBottom = imageOffset + imageHeight;
  const fadeTop = Math.round(Math.min(height * fadeStart, imageBottom - MIN_FADE));
  const fadeHeight = Math.max(MIN_FADE, Math.max(imageBottom, height) - fadeTop);
  return { imageHeight, imageBottom, fadeTop, fadeHeight };
}
