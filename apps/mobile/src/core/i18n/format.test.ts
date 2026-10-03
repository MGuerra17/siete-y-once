import { formatMessage } from "@/src/core/i18n/format";
import { translations } from "@/src/core/i18n/translations";

describe("formatMessage", () => {
  it("replaces every placeholder, including repeated ones", () => {
    expect(formatMessage("{a} and {b}, {a}!", { a: "Ana", b: 2 })).toBe("Ana and 2, Ana!");
  });

  it("keeps unknown placeholders and returns the template without params", () => {
    expect(formatMessage("Hi {name}", { other: 1 })).toBe("Hi {name}");
    expect(formatMessage("Hi {name}")).toBe("Hi {name}");
  });
});

describe("translations", () => {
  it("use the same placeholders in every language", () => {
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();
    for (const key of Object.keys(translations.en) as (keyof typeof translations.en)[]) {
      expect([key, placeholders(translations.es[key])]).toEqual([key, placeholders(translations.en[key])]);
    }
  });
});
