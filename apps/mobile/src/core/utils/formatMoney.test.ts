import { formatMoney, formatMoneyCompact } from "@/src/core/utils/formatMoney";

describe("formatMoney", () => {
  it("groups thousands per language", () => {
    expect(formatMoney(1_250_000, "es")).toBe("$1.250.000");
    expect(formatMoney(1_250_000, "en")).toBe("$1,250,000");
    expect(formatMoney(50_000, "es")).toBe("$50.000");
    expect(formatMoney(0, "es")).toBe("$0");
  });
});

describe("formatMoneyCompact", () => {
  it("abbreviates thousands and millions", () => {
    expect(formatMoneyCompact(400_000)).toBe("400K");
    expect(formatMoneyCompact(1_250_000)).toBe("1.25M");
    expect(formatMoneyCompact(2_000_000)).toBe("2M");
  });
});
