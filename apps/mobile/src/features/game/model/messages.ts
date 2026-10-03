import {
  GamePhase,
  getBettorId,
  getOpponentId,
  type GameOutcome,
  type GameState,
  type PlayerId,
} from "@seven/game-core";
import type { MessageParams } from "@/src/core/i18n/format";
import type { TranslationKey } from "@/src/core/i18n/translations";

export type Message = { key: TranslationKey; params?: MessageParams };

type NameOf = (playerId: PlayerId) => string;

const ROUND_WON_KEYS = {
  NATURAL: "game.toast.shooterWinsNatural",
  CRAPS: "game.toast.bettorWinsCraps",
  POINT: "game.toast.shooterWinsPoint",
  SEVEN_OUT: "game.toast.bettorWinsSeven",
} as const satisfies Record<string, TranslationKey>;

function describeOutcome(outcome: GameOutcome, state: GameState, nameOf: NameOf): Message | null {
  switch (outcome.kind) {
    case "INITIAL_ROLL_RECORDED":
      return {
        key: "game.toast.playerRolled",
        params: {
          name: nameOf(outcome.playerId),
          sum: outcome.sum,
          next: nameOf(getOpponentId(outcome.playerId)),
        },
      };
    case "INITIAL_ROLL_TIE":
      return { key: "game.toast.tie" };
    case "SHOOTER_DECIDED":
      return { key: "game.toast.shooterDetermined", params: { name: nameOf(outcome.shooterId) } };
    case "POINT_SET":
      return { key: "game.toast.pointSet", params: { point: outcome.point } };
    case "ROLL_CONTINUES":
      return { key: "game.toast.continueRolling", params: { sum: outcome.sum } };
    case "ROUND_WON":
      return {
        key: ROUND_WON_KEYS[outcome.reason],
        params: { name: nameOf(outcome.result.winnerId), amount: outcome.result.amount },
      };
    case "BET_PLACED":
    case "BET_KEPT":
      return state.shooterId
        ? { key: "game.toast.shooterRoll", params: { name: nameOf(state.shooterId) } }
        : null;
    case "BET_LOCK_CHANGED":
    case "GAME_OVER":
      return null;
  }
}

/** The headline for a batch of outcomes: the last one that has something to say. */
export function describeOutcomes(
  outcomes: readonly GameOutcome[],
  state: GameState,
  nameOf: NameOf,
): Message | null {
  let message: Message | null = null;
  for (const outcome of outcomes) {
    message = describeOutcome(outcome, state, nameOf) ?? message;
  }
  return message;
}

/** What the active player should do next, e.g. "Ana, place your bet!". */
export function describePrompt(state: GameState, nameOf: NameOf): Message | null {
  switch (state.phase) {
    case GamePhase.BET_PLACEMENT:
    case GamePhase.POINT_PHASE: {
      const bettorId = getBettorId(state);
      return bettorId ? { key: "game.toast.placeBet", params: { name: nameOf(bettorId) } } : null;
    }
    case GamePhase.SHOOTER_ROLLING:
    case GamePhase.WAITING_FOR_ROLL:
      return state.shooterId
        ? { key: "game.toast.shooterRoll", params: { name: nameOf(state.shooterId) } }
        : null;
    case GamePhase.INITIAL_ROLL:
    case GamePhase.GAME_OVER:
      return null;
  }
}

/** True when a dice roll produced these outcomes (used to play the roll animation). */
export const isRollOutcome = (outcomes: readonly GameOutcome[]): boolean =>
  outcomes.some((o) =>
    ["INITIAL_ROLL_RECORDED", "POINT_SET", "ROLL_CONTINUES", "ROUND_WON"].includes(o.kind),
  );

/** In the point phase a bettor who cannot raise anymore keeps the bet automatically. */
export const mustAutoKeepBet = (state: GameState, maxBet: number): boolean =>
  state.phase === GamePhase.POINT_PHASE && state.currentBet >= maxBet;
