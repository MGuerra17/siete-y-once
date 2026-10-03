import type { Language } from "@/src/core/i18n/translations";

const THOUSANDS_SEPARATOR: Record<Language, string> = { es: ".", en: "," };

/**
 * Full amount with the currency sign, grouped the way each language expects.
 * Examples: es 1_250_000 → "$1.250.000", en → "$1,250,000".
 * Done by hand so it is identical on Hermes, JSC and Node (tests).
 */
export const formatMoney = (amount: number, language: Language): string => {
  const sign = amount < 0 ? "-" : "";
  const digits = Math.round(Math.abs(amount)).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR[language]);
  return `${sign}$${grouped}`;
};

/**
 * Formats a money amount for compact display using K (thousands) and M (millions).
 * Examples: 50_000 → "50K", 1_000_000 → "1M", 1_250_000 → "1.25M", 1_500_000 → "1.5M"
 */
export const formatMoneyCompact = (amount: number): string => {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return millions % 1 === 0
      ? `${millions}M`
      : `${millions.toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    return thousands % 1 === 0
      ? `${thousands}K`
      : `${thousands.toFixed(2).replace(/\.?0+$/, "")}K`;
  }
  return amount.toLocaleString();
};
