/** Phases of a Seven-Eleven game from start to finish. */
export enum GamePhase {
  /** Both players roll to determine who becomes the shooter (highest wins). */
  INITIAL_ROLL = "INITIAL_ROLL",
  /** The bettor is placing (or raising) a bet before the shooter rolls. */
  BET_PLACEMENT = "BET_PLACEMENT",
  /** The shooter's come-out roll — natural (7/11) or craps (2/3/12) resolves immediately. */
  SHOOTER_ROLLING = "SHOOTER_ROLLING",
  /** A point was established; waiting for the bettor to confirm/raise the bet. */
  POINT_PHASE = "POINT_PHASE",
  /** Bet is locked (keepBet); waiting for the shooter to roll again. */
  WAITING_FOR_ROLL = "WAITING_FOR_ROLL",
  /** One player is broke — the game is over. */
  GAME_OVER = "GAME_OVER",
}
