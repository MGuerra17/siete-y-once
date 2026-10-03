import { countdownProgress, secondsLeft } from "@/src/features/game/model/countdown";

describe("countdownProgress", () => {
  it("goes from 0 to 1 over the duration", () => {
    expect(countdownProgress(10_000, 8_000, 2_000)).toBe(0);
    expect(countdownProgress(10_000, 8_000, 6_000)).toBe(0.5);
    expect(countdownProgress(10_000, 8_000, 10_000)).toBe(1);
  });

  it("keeps the ring full during the server's extra buffer and clamps after expiry", () => {
    expect(countdownProgress(11_000, 8_000, 0)).toBe(0);
    expect(countdownProgress(10_000, 8_000, 99_000)).toBe(1);
  });
});

describe("secondsLeft", () => {
  it("rounds up and never goes negative", () => {
    expect(secondsLeft(10_000, 8_001)).toBe(2);
    expect(secondsLeft(10_000, 12_000)).toBe(0);
  });
});
