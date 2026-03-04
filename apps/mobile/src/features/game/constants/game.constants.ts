/** Starting money for each player at the beginning of a game. */
export const INITIAL_MONEY = 1_000_000;

/** Minimum (and default first) bet amount. Also used to determine if a player is broke. */
export const MIN_BET = 50_000;

/** Available bet increment/decrement steps shown in the BetBottomSheet. */
export const BET_STEPS = [50_000, 100_000, 200_000] as const;

/** How long the dice-rolling animation plays before revealing the result. */
export const ROLL_DURATION_MS = 500;

/** Pause between revealing a result and transitioning to the next phase. */
export const RESULT_DELAY_MS = 2_000;

/** Dice sums that win for the shooter on the come-out roll (natural). */
export const SHOOTER_NATURAL_WINS = [7, 11] as const;

/** Dice sums that win for the bettor on the come-out roll (craps). */
export const BETTOR_CRAPS_WINS = [2, 3, 12] as const;
