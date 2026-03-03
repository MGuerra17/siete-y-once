/**
 * Formats a money amount for compact display using K (thousands) and M (millions).
 * Examples: 50_000 → "50K", 1_000_000 → "1M", 1_500_000 → "1.5M"
 */
export const formatMoneyCompact = (amount: number): string => {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }
  return amount.toLocaleString();
};
