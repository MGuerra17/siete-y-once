/** Starting money for each player. */
export const INITIAL_MONEY = 1_000_000;

/** Minimum bet. A player who cannot cover it is broke and loses the game. */
export const MIN_BET = 50_000;

/** Increments offered by the bet controls. Bets must be a multiple of the smallest step. */
export const BET_STEPS = [50_000, 100_000, 200_000] as const;

/** Come-out sums that win for the shooter ("natural"). */
export const NATURAL_SUMS = [7, 11] as const;

/** Come-out sums that win for the bettor ("craps"). */
export const CRAPS_SUMS = [2, 3, 12] as const;

/** Rolling this sum after a point is set wins for the bettor ("seven-out"). */
export const SEVEN_OUT_SUM = 7;

/** Time the active player has to act before the default action is applied. */
export const TURN_TIMEOUT_MS = 8_000;

/** Time a disconnected player has to reconnect before forfeiting an online game. */
export const RECONNECT_GRACE_MS = 60_000;
