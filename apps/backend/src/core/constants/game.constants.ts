/** Starting money for each player at the beginning of a game. */
export const INITIAL_MONEY = 1_000_000;

/** Minimum (and default first) bet amount. Also used to determine if a player is broke. */
export const MIN_BET = 50_000;

/** Available bet increment steps (for validation). */
export const BET_STEPS = [50_000, 100_000, 200_000] as const;

/** Dice sums that win for the shooter on the come-out roll (natural). */
export const SHOOTER_NATURAL_WINS = [7, 11] as const;

/** Dice sums that win for the bettor on the come-out roll (craps). */
export const BETTOR_CRAPS_WINS = [2, 3, 12] as const;

/** Time (ms) after which the server applies default action for disconnected player. */
export const ACTION_TIMEOUT_MS = 8_000;

/** Time (ms) a player can be disconnected before the other can claim victory by abandonment. */
export const ABANDONMENT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

/** Length of the shareable game code. */
export const SHORT_CODE_LENGTH = 6;

/** Characters for short code (no 0/O, 1/I/L to avoid confusion). */
export const SHORT_CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
