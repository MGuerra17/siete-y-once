export type PlayerId = "player1" | "player2";

export type Dice = readonly [number, number];

export const GamePhase = {
  /** Each player rolls once; the higher sum becomes the shooter. Ties re-roll. */
  INITIAL_ROLL: "INITIAL_ROLL",
  /** The bettor places the opening bet of the round. */
  BET_PLACEMENT: "BET_PLACEMENT",
  /** The shooter's come-out roll. */
  SHOOTER_ROLLING: "SHOOTER_ROLLING",
  /** A point is set; the bettor keeps or raises the bet. */
  POINT_PHASE: "POINT_PHASE",
  /** The bet is confirmed; the shooter rolls for the point. */
  WAITING_FOR_ROLL: "WAITING_FOR_ROLL",
  GAME_OVER: "GAME_OVER",
} as const;
export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase];

export const PlayerRole = {
  SHOOTER: "SHOOTER",
  BETTOR: "BETTOR",
} as const;
export type PlayerRole = (typeof PlayerRole)[keyof typeof PlayerRole];

export type GameEndReason = "BANKRUPT" | "FORFEIT";

export interface RoundResult {
  winnerId: PlayerId;
  winningSum: number;
  amount: number;
}

/**
 * Complete, serializable state of a game. Everything else (roles, active player,
 * winning numbers, bet limits) is derived through the selectors.
 */
export interface GameState {
  phase: GamePhase;
  money: Record<PlayerId, number>;
  shooterId: PlayerId | null;
  initialRolls: Partial<Record<PlayerId, number>>;
  currentBet: number;
  /** When true the bettor keeps the current bet automatically for the rest of the round. */
  betLocked: boolean;
  point: number | null;
  /** Last dice rolled, or null before the first roll. */
  dice: Dice | null;
  /** Number of completed rounds. */
  round: number;
  lastRound: RoundResult | null;
  winnerId: PlayerId | null;
  endReason: GameEndReason | null;
}

export type GameAction =
  | { type: "INITIAL_ROLL"; playerId: PlayerId; dice: Dice }
  | { type: "PLACE_BET"; playerId: PlayerId; amount: number }
  | { type: "KEEP_BET"; playerId: PlayerId; lock?: boolean }
  | { type: "SET_BET_LOCK"; playerId: PlayerId; locked: boolean }
  | { type: "ROLL"; playerId: PlayerId; dice: Dice }
  | { type: "FORFEIT"; playerId: PlayerId };

/** What happened as a consequence of an action; drives toasts, sounds and animations. */
export type GameOutcome =
  | { kind: "INITIAL_ROLL_RECORDED"; playerId: PlayerId; sum: number }
  | { kind: "INITIAL_ROLL_TIE"; sum: number }
  | { kind: "SHOOTER_DECIDED"; shooterId: PlayerId }
  | { kind: "BET_PLACED"; amount: number }
  | { kind: "BET_KEPT"; amount: number }
  | { kind: "BET_LOCK_CHANGED"; locked: boolean }
  | { kind: "POINT_SET"; point: number }
  | { kind: "ROLL_CONTINUES"; sum: number }
  | {
      kind: "ROUND_WON";
      result: RoundResult;
      reason: "NATURAL" | "CRAPS" | "POINT" | "SEVEN_OUT";
    }
  | { kind: "GAME_OVER"; winnerId: PlayerId; reason: GameEndReason };

export type GameErrorCode =
  | "GAME_OVER"
  | "WRONG_PHASE"
  | "NOT_YOUR_TURN"
  | "INVALID_DICE"
  | "INVALID_BET";

export type ReduceResult =
  | { ok: true; state: GameState; outcomes: GameOutcome[] }
  | { ok: false; error: GameErrorCode };
