import { INITIAL_MONEY, MIN_BET, NATURAL_SUMS, CRAPS_SUMS, SEVEN_OUT_SUM } from "./constants";
import { diceSum, isValidDice } from "./dice";
import { getActivePlayerId, getBettorId, getOpponentId, isBroke, isValidBetAmount } from "./selectors";
import {
  GamePhase,
  type Dice,
  type GameAction,
  type GameErrorCode,
  type GameOutcome,
  type GameState,
  type PlayerId,
  type ReduceResult,
} from "./types";

type RoundWinReason = Extract<GameOutcome, { kind: "ROUND_WON" }>["reason"];

export const createInitialState = (): GameState => ({
  phase: GamePhase.INITIAL_ROLL,
  money: { player1: INITIAL_MONEY, player2: INITIAL_MONEY },
  shooterId: null,
  initialRolls: {},
  currentBet: 0,
  betLocked: false,
  point: null,
  dice: null,
  round: 0,
  lastRound: null,
  winnerId: null,
  endReason: null,
});

const fail = (error: GameErrorCode): ReduceResult => ({ ok: false, error });

const ok = (state: GameState, ...outcomes: GameOutcome[]): ReduceResult => ({
  ok: true,
  state,
  outcomes,
});

const includesSum = (sums: readonly number[], sum: number) => sums.includes(sum);

function applyInitialRoll(state: GameState, playerId: PlayerId, dice: Dice): ReduceResult {
  const sum = diceSum(dice);
  const initialRolls = { ...state.initialRolls, [playerId]: sum };
  const opponentSum = initialRolls[getOpponentId(playerId)];
  const recorded: GameOutcome = { kind: "INITIAL_ROLL_RECORDED", playerId, sum };

  if (opponentSum === undefined) {
    return ok({ ...state, dice, initialRolls }, recorded);
  }
  if (opponentSum === sum) {
    return ok({ ...state, dice, initialRolls: {} }, recorded, { kind: "INITIAL_ROLL_TIE", sum });
  }

  const shooterId = sum > opponentSum ? playerId : getOpponentId(playerId);
  return ok(
    { ...state, dice, initialRolls, shooterId, phase: GamePhase.BET_PLACEMENT },
    recorded,
    { kind: "SHOOTER_DECIDED", shooterId },
  );
}

function resolveRound(
  state: GameState,
  dice: Dice,
  winnerId: PlayerId,
  reason: RoundWinReason,
): ReduceResult {
  const loserId = getOpponentId(winnerId);
  const amount = state.currentBet;
  const money = {
    ...state.money,
    [winnerId]: state.money[winnerId] + amount,
    [loserId]: state.money[loserId] - amount,
  } as GameState["money"];
  const result = { winnerId, winningSum: diceSum(dice), amount };
  const roundWon: GameOutcome = { kind: "ROUND_WON", result, reason };

  const base: GameState = {
    ...state,
    dice,
    money,
    round: state.round + 1,
    lastRound: result,
    currentBet: 0,
    betLocked: false,
    point: null,
  };

  if (isBroke(money[loserId])) {
    return ok(
      { ...base, phase: GamePhase.GAME_OVER, winnerId, endReason: "BANKRUPT" },
      roundWon,
      { kind: "GAME_OVER", winnerId, reason: "BANKRUPT" },
    );
  }

  // The round winner becomes (or stays) the shooter.
  return ok({ ...base, shooterId: winnerId, phase: GamePhase.BET_PLACEMENT }, roundWon);
}

function applyRoll(state: GameState, dice: Dice): ReduceResult {
  const shooterId = state.shooterId!;
  const bettorId = getOpponentId(shooterId);
  const sum = diceSum(dice);

  if (state.point === null) {
    if (includesSum(NATURAL_SUMS, sum)) return resolveRound(state, dice, shooterId, "NATURAL");
    if (includesSum(CRAPS_SUMS, sum)) return resolveRound(state, dice, bettorId, "CRAPS");
    const phase = state.betLocked ? GamePhase.WAITING_FOR_ROLL : GamePhase.POINT_PHASE;
    return ok({ ...state, dice, point: sum, phase }, { kind: "POINT_SET", point: sum });
  }

  if (sum === state.point) return resolveRound(state, dice, shooterId, "POINT");
  if (sum === SEVEN_OUT_SUM) return resolveRound(state, dice, bettorId, "SEVEN_OUT");

  const phase = state.betLocked ? GamePhase.WAITING_FOR_ROLL : GamePhase.POINT_PHASE;
  return ok({ ...state, dice, phase }, { kind: "ROLL_CONTINUES", sum });
}

/**
 * Pure state transition. Randomness (dice) is supplied by the caller so the same
 * rules run identically on the device (offline mode) and on the server (online mode).
 */
export function reduce(state: GameState, action: GameAction): ReduceResult {
  if (state.phase === GamePhase.GAME_OVER) return fail("GAME_OVER");

  if (action.type === "FORFEIT") {
    const winnerId = getOpponentId(action.playerId);
    return ok(
      { ...state, phase: GamePhase.GAME_OVER, winnerId, endReason: "FORFEIT" },
      { kind: "GAME_OVER", winnerId, reason: "FORFEIT" },
    );
  }

  const isBettorAction = action.type === "SET_BET_LOCK";
  const expectedPlayer = isBettorAction ? getBettorId(state) : getActivePlayerId(state);
  if (action.playerId !== expectedPlayer) return fail("NOT_YOUR_TURN");

  switch (action.type) {
    case "INITIAL_ROLL":
      if (state.phase !== GamePhase.INITIAL_ROLL) return fail("WRONG_PHASE");
      if (!isValidDice(action.dice)) return fail("INVALID_DICE");
      return applyInitialRoll(state, action.playerId, action.dice);

    case "PLACE_BET": {
      if (state.phase !== GamePhase.BET_PLACEMENT && state.phase !== GamePhase.POINT_PHASE) {
        return fail("WRONG_PHASE");
      }
      if (!isValidBetAmount(state, action.amount)) return fail("INVALID_BET");
      const phase =
        state.phase === GamePhase.BET_PLACEMENT
          ? GamePhase.SHOOTER_ROLLING
          : GamePhase.WAITING_FOR_ROLL;
      return ok(
        { ...state, currentBet: action.amount, phase },
        { kind: "BET_PLACED", amount: action.amount },
      );
    }

    case "KEEP_BET": {
      if (state.phase !== GamePhase.POINT_PHASE) return fail("WRONG_PHASE");
      const betLocked = action.lock ?? state.betLocked;
      return ok(
        { ...state, betLocked, phase: GamePhase.WAITING_FOR_ROLL },
        { kind: "BET_KEPT", amount: state.currentBet },
      );
    }

    case "SET_BET_LOCK":
      if (state.phase === GamePhase.INITIAL_ROLL) return fail("WRONG_PHASE");
      return ok(
        { ...state, betLocked: action.locked },
        { kind: "BET_LOCK_CHANGED", locked: action.locked },
      );

    case "ROLL":
      if (state.phase !== GamePhase.SHOOTER_ROLLING && state.phase !== GamePhase.WAITING_FOR_ROLL) {
        return fail("WRONG_PHASE");
      }
      if (!isValidDice(action.dice)) return fail("INVALID_DICE");
      return applyRoll(state, action.dice);
  }
}

/**
 * Action applied when the active player lets the turn timer expire:
 * roll for them, place the minimum bet, or keep the current bet.
 */
export function getDefaultAction(state: GameState, dice: Dice): GameAction | null {
  const playerId = getActivePlayerId(state);
  if (!playerId) return null;

  switch (state.phase) {
    case GamePhase.INITIAL_ROLL:
      return { type: "INITIAL_ROLL", playerId, dice };
    case GamePhase.BET_PLACEMENT:
      return { type: "PLACE_BET", playerId, amount: MIN_BET };
    case GamePhase.POINT_PHASE:
      return { type: "KEEP_BET", playerId };
    case GamePhase.SHOOTER_ROLLING:
    case GamePhase.WAITING_FOR_ROLL:
      return { type: "ROLL", playerId, dice };
    case GamePhase.GAME_OVER:
      return null;
  }
}
