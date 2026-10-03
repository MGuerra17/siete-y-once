import { posterLayout } from "@/src/core/components/PosterScreen/posterLayout";

describe("posterLayout", () => {
  it("keeps the 9:16 illustration and starts the fade at the requested point", () => {
    const layout = posterLayout({ width: 390, height: 844, imageOffset: 0, fadeStart: 0.6 });
    expect(layout.imageHeight).toBe(693);
    expect(layout.fadeTop).toBe(Math.round(844 * 0.6));
    expect(layout.fadeTop + layout.fadeHeight).toBeGreaterThanOrEqual(844);
  });

  it("starts the fade earlier on screens taller than the picture", () => {
    // 20:9 Android phone: the picture ends at 640 px of a 900 px screen.
    const layout = posterLayout({ width: 360, height: 900, imageOffset: 0, fadeStart: 0.7 });
    expect(layout.imageBottom).toBe(640);
    expect(layout.fadeTop).toBeLessThanOrEqual(640 - 160);
  });

  it("accounts for an illustration shifted upwards", () => {
    const layout = posterLayout({ width: 390, height: 844, imageOffset: -120, fadeStart: 0.39 });
    expect(layout.imageBottom).toBe(573);
    expect(layout.fadeTop).toBe(Math.round(844 * 0.39));
  });
});
