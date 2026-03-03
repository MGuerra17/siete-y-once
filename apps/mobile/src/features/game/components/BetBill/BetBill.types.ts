export type BetBillProps = {
  visible?: boolean;
  amount: number;
  side?: "left" | "right";
  centered?: boolean;
  keepBet?: boolean;
  onKeepBetToggle?: () => void;
  showLockButton?: boolean;
  /** When true and keepBet is true, lock cannot be toggled off (e.g. bet at max) */
  lockPermanent?: boolean;
};
