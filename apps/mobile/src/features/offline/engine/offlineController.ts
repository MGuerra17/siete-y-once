import {
  GamePhase,
  MIN_BET,
  TURN_TIMEOUT_MS,
  getActivePlayerId,
  getBettorId,
  getDefaultAction,
  getMaxBet,
  reduce,
  rollDice,
  type GameAction,
  type GameOutcome,
  type PlayerId,
  type RandomSource,
} from "@seven/game-core";
import { translateNow } from "@/src/core/i18n/translator";
import type { Emitter } from "@/src/core/utils/emitter";
import { runCancellable, sleep } from "@/src/core/utils/sleep";
import { RESULT_DELAY_MS, ROLL_DURATION_MS } from "@/src/features/game/constants/ui.constants";
import {
  describeOutcomes,
  describePrompt,
  mustAutoKeepBet,
  type Message,
} from "@/src/features/game/model/messages";
import type { GameEvent } from "@/src/features/game/types";
import {
  createOfflineInitialState,
  type OfflineGameState,
} from "@/src/features/offline/store/offlineGameStore";

const ROLL_PHASES = new Set<GamePhase>([
  GamePhase.INITIAL_ROLL,
  GamePhase.SHOOTER_ROLLING,
  GamePhase.WAITING_FOR_ROLL,
]);

export type OfflineControllerDeps = {
  getState: () => OfflineGameState;
  setState: (patch: Partial<OfflineGameState>) => void;
  events: Emitter<GameEvent>;
  /** Display name for a player; read lazily so language changes apply. */
  nameOf: (playerId: PlayerId) => string;
  translate?: (message: Message) => string;
  random?: RandomSource;
  now?: () => number;
  timings?: { rollMs: number; resultMs: number };
};

/**
 * Drives a same-device game: applies rules through game-core and paces the
 * presentation (roll animation, result toasts, prompts). Every pending step is
 * tied to an AbortSignal, so leaving the screen cancels it instead of letting it
 * mutate the next game.
 */
export function createOfflineController(deps: OfflineControllerDeps) {
  const { getState, setState, events, nameOf } = deps;
  const translate = deps.translate ?? ((m: Message) => translateNow(m.key, m.params));
  const random = deps.random ?? Math.random;
  const now = deps.now ?? Date.now;
  const { rollMs, resultMs } = deps.timings ?? {
    rollMs: ROLL_DURATION_MS,
    resultMs: RESULT_DELAY_MS,
  };

  let abort = new AbortController();
  let flyerKey = 0;

  const toast = (message: Message | null) => {
    if (message) setState({ toastMessage: translate(message) });
  };

  const startTurn = () => setState({ turnDeadline: now() + TURN_TIMEOUT_MS });

  const dispatch = (action: GameAction) => {
    const result = reduce(getState().core, action);
    if (result.ok) setState({ core: result.state });
    return result;
  };

  /** Asks the next player to act, auto-keeping a bet that can no longer be raised. */
  const prompt = () => {
    setState({ flyer: null });
    const { core } = getState();
    if (mustAutoKeepBet(core, getMaxBet(core))) {
      const bettorId = getBettorId(core)!;
      const kept = dispatch({ type: "KEEP_BET", playerId: bettorId, lock: true });
      if (kept.ok) toast(describeOutcomes(kept.outcomes, kept.state, nameOf));
    } else {
      toast(describePrompt(core, nameOf));
      const phase = getState().core.phase;
      if (phase === GamePhase.BET_PLACEMENT || phase === GamePhase.POINT_PHASE) {
        setState({ isBetSheetVisible: true });
      }
    }
    startTurn();
  };

  const present = async (outcomes: GameOutcome[], signal: AbortSignal) => {
    for (const outcome of outcomes) {
      if (outcome.kind === "ROUND_WON") {
        events.emit({ type: "roundWon", mine: true });
        setState({
          flyer: {
            playerId: outcome.result.winnerId,
            number: outcome.result.winningSum,
            key: ++flyerKey,
          },
        });
      }
      if (outcome.kind === "GAME_OVER") events.emit({ type: "gameOver", mine: true });
    }
    toast(describeOutcomes(outcomes, getState().core, nameOf));
    if (getState().core.phase === GamePhase.GAME_OVER) {
      setState({ isProcessing: false });
      return;
    }
    await sleep(resultMs, signal);
    prompt();
    setState({ isProcessing: false });
  };

  const roll = async (signal: AbortSignal) => {
    const { core } = getState();
    const playerId = getActivePlayerId(core);
    if (!playerId) return;
    const type = core.phase === GamePhase.INITIAL_ROLL ? "INITIAL_ROLL" : "ROLL";

    setState({ isRolling: true, isProcessing: true, turnDeadline: null });
    events.emit({ type: "roll" });
    await sleep(rollMs, signal);

    const result = reduce(getState().core, { type, playerId, dice: rollDice(random) });
    if (!result.ok) {
      setState({ isRolling: false, isProcessing: false });
      startTurn();
      return;
    }
    setState({ core: result.state, isRolling: false });
    await present(result.outcomes, signal);
  };

  const canRoll = () => {
    const { core, isProcessing, isRolling } = getState();
    return !isProcessing && !isRolling && ROLL_PHASES.has(core.phase);
  };

  const pressDice = () => {
    if (!canRoll()) return;
    const { signal } = abort;
    runCancellable(() => roll(signal));
  };

  const submitBet = (amount: number) => {
    const { core, isBetSheetVisible, isProcessing } = getState();
    if (!isBetSheetVisible || isProcessing) return;
    const bettorId = getBettorId(core);
    if (!bettorId) return;
    const action: GameAction =
      core.phase === GamePhase.POINT_PHASE && amount === core.currentBet
        ? { type: "KEEP_BET", playerId: bettorId }
        : { type: "PLACE_BET", playerId: bettorId, amount };
    const result = dispatch(action);
    if (!result.ok) return;
    setState({ isBetSheetVisible: false });
    events.emit({ type: "bet" });
    toast(describeOutcomes(result.outcomes, result.state, nameOf));
    startTurn();
  };

  return {
    /** Resets the game and starts a fresh session (safe to call after `dispose`). */
    start() {
      abort.abort();
      abort = new AbortController();
      setState(createOfflineInitialState());
      toast({ key: "game.toast.rollToDetermineShooter" });
      startTurn();
    },

    pressDice,

    submitBet,

    toggleBetLock() {
      const { core } = getState();
      const bettorId = getBettorId(core);
      if (bettorId) dispatch({ type: "SET_BET_LOCK", playerId: bettorId, locked: !core.betLocked });
    },

    /** Applies the default action for the active player when the turn timer expires. */
    expireTurn() {
      const { core, isProcessing, isRolling } = getState();
      if (isProcessing || isRolling) return;
      const action = getDefaultAction(core, [1, 1]);
      if (!action) return;
      if (action.type === "INITIAL_ROLL" || action.type === "ROLL") {
        pressDice();
      } else if (action.type === "PLACE_BET") {
        submitBet(MIN_BET);
      } else if (action.type === "KEEP_BET") {
        submitBet(core.currentBet);
      }
    },

    /** Restarts the turn timer, e.g. after the exit dialog paused it. */
    restartTurnTimer() {
      if (getState().turnDeadline !== null) startTurn();
    },

    dismissToast() {
      setState({ toastMessage: null });
    },

    /** Cancels every pending step. */
    dispose() {
      abort.abort();
    },
  };
}

export type OfflineController = ReturnType<typeof createOfflineController>;
