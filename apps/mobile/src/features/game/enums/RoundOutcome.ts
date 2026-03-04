/** Possible outcomes of evaluating a dice roll within a round. */
export enum RoundOutcome {
  /** Come-out roll of 7 or 11 — shooter wins immediately. */
  SHOOTER_WINS_NATURAL = "SHOOTER_WINS_NATURAL",
  /** Come-out roll of 2, 3, or 12 — bettor wins immediately. */
  BETTOR_WINS_CRAPS = "BETTOR_WINS_CRAPS",
  /** Come-out roll sets the point — the round continues. */
  POINT_SET = "POINT_SET",
  /** Subsequent roll matches the point — shooter wins. */
  SHOOTER_WINS_POINT = "SHOOTER_WINS_POINT",
  /** Subsequent roll is 7 — bettor wins (seven-out). */
  BETTOR_WINS_SEVEN = "BETTOR_WINS_SEVEN",
  /** Subsequent roll is neither the point nor 7 — keep rolling. */
  CONTINUE = "CONTINUE",
}
