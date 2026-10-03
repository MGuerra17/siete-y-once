import { GamePhase, getBettorId, type PlayerId } from "@seven/game-core";
import type { ClientMessage, ErrorCode, PublicGame, ServerMessage } from "@seven/protocol";
import { translateNow } from "@/src/core/i18n/translator";
import type { Emitter } from "@/src/core/utils/emitter";
import { CancelledError, sleep } from "@/src/core/utils/sleep";
import { RESULT_DELAY_MS, ROLL_DURATION_MS } from "@/src/features/game/constants/ui.constants";
import { createSeatMapper } from "@/src/features/game/model/boardView";
import { describePrompt, type Message } from "@/src/features/game/model/messages";
import type { GameEvent } from "@/src/features/game/types";
import {
  displayNameOf,
  errorMessageKey,
  isMyBettingTurn,
  isMyTurn,
  isNewer,
  planGameMessage,
  shouldAutoKeepBet,
  type GameStateMessage,
} from "@/src/features/online/model/presentation";
import {
  createSocketClient,
  type SocketClientOptions,
} from "@/src/features/online/services/socketClient";
import {
  clearSession,
  getSession,
  saveSession,
  type OnlineSession,
} from "@/src/features/online/storage/onlineStorage";
import {
  createOnlineInitialState,
  type OnlineGameState,
} from "@/src/features/online/store/onlineGameStore";

export type RequestResult = { ok: true } | { ok: false; reason: ErrorCode | "CONNECTION" | "TIMEOUT" };

export type OnlineClientDeps = {
  url: string;
  createSocket?: SocketClientOptions["createSocket"];
  getState: () => OnlineGameState;
  setState: (patch: Partial<OnlineGameState>) => void;
  events: Emitter<GameEvent>;
  storage?: {
    getSession: () => Promise<OnlineSession | null>;
    saveSession: (session: OnlineSession) => Promise<void>;
    clearSession: () => Promise<void>;
  };
  translate?: (message: Message) => string;
  now?: () => number;
  timings?: Partial<typeof DEFAULT_TIMINGS>;
};

const DEFAULT_TIMINGS = {
  rollMs: ROLL_DURATION_MS,
  resultMs: RESULT_DELAY_MS,
  /** Give up on a lobby request or an unanswered action after this long. */
  requestTimeoutMs: 10_000,
  /** Re-send a turn timeout once if the first one raced the server deadline. */
  timeoutRetryMs: 1_000,
};

const ROLL_PHASES = new Set<string>([
  GamePhase.INITIAL_ROLL,
  GamePhase.SHOOTER_ROLLING,
  GamePhase.WAITING_FOR_ROLL,
]);

/**
 * Online game session: one WebSocket, server snapshots presented in order, and the
 * local player's actions sent to the authoritative server.
 */
export function createOnlineClient(deps: OnlineClientDeps) {
  const { getState, setState, events } = deps;
  const storage = deps.storage ?? { getSession, saveSession, clearSession };
  const translate = deps.translate ?? ((m: Message) => translateNow(m.key, m.params));
  const now = deps.now ?? Date.now;
  const timings = { ...DEFAULT_TIMINGS, ...deps.timings };
  const socket = createSocketClient({ url: deps.url, createSocket: deps.createSocket });

  let abort = new AbortController();
  let queue: Promise<void> = Promise.resolve();
  /** Newest snapshot received (the one on screen may still be animating towards it). */
  let latest: PublicGame | null = null;
  let pending: { resolve: (result: RequestResult) => void; timer: ReturnType<typeof setTimeout> } | null =
    null;
  let awaitTimer: ReturnType<typeof setTimeout> | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let rollStartedAt = 0;
  let flyerKey = 0;

  const localId = (): PlayerId => getState().session?.playerId ?? "player1";

  const toast = (message: Message | null) => {
    if (message) setState({ toastMessage: translate(message) });
  };

  const settle = (result: RequestResult) => {
    if (!pending) return;
    clearTimeout(pending.timer);
    const { resolve } = pending;
    pending = null;
    resolve(result);
  };

  const stopAwaiting = () => {
    if (awaitTimer) clearTimeout(awaitTimer);
    awaitTimer = null;
    setState({ isAwaitingServer: false });
  };

  const startRolling = () => {
    if (getState().isRolling) return;
    rollStartedAt = now();
    setState({ isRolling: true });
    events.emit({ type: "roll" });
  };

  /** Sends a gameplay action; guards against double taps and unanswered requests. */
  const sendAction = (message: ClientMessage, options: { rolls?: boolean } = {}): boolean => {
    if (getState().isAwaitingServer) return false;
    if (!socket.send(message)) {
      toast({ key: "online.error.connectionFailed" });
      return false;
    }
    setState({ isAwaitingServer: true });
    if (options.rolls) startRolling();
    awaitTimer = setTimeout(() => {
      awaitTimer = null;
      setState({ isAwaitingServer: false, isRolling: false });
    }, timings.requestTimeoutMs);
    return true;
  };

  const present = async (message: GameStateMessage, signal: AbortSignal) => {
    const me = localId();
    const plan = planGameMessage(message, me);
    const isFirst = getState().game === null;

    if (plan.animateRoll && !isFirst) {
      startRolling();
      await sleep(Math.max(0, timings.rollMs - (now() - rollStartedAt)), signal);
    }

    stopAwaiting();
    setState({
      game: message.game,
      serverOffsetMs: message.serverTime - now(),
      isRolling: false,
      isPresenting: plan.animateRoll,
    });
    settle({ ok: true });

    const { toSeat } = createSeatMapper(me);
    if (plan.roundWon) {
      events.emit({ type: "roundWon", mine: plan.roundWon.mine });
      setState({
        flyer: {
          playerId: toSeat(plan.roundWon.winnerId),
          number: plan.roundWon.winningSum,
          key: ++flyerKey,
        },
      });
    }
    if (plan.gameOver) {
      events.emit({ type: "gameOver", mine: plan.gameOver.mine });
      void storage.clearSession();
    }
    toast(plan.toast);

    const game = message.game;
    if (plan.animateRoll && game.state.phase !== GamePhase.GAME_OVER) {
      await sleep(timings.resultMs, signal);
      setState({ flyer: null });
      toast(describePrompt(game.state, (id) => displayNameOf(game, id)));
    }
    setState({ isPresenting: false });

    const shown = getState().game;
    if (shown && shown === latest && shouldAutoKeepBet(shown, me)) {
      sendAction({ action: "keepBet", payload: { lock: true } });
    }
  };

  const enqueue = (message: GameStateMessage) => {
    const { signal } = abort;
    queue = queue
      .then(() => present(message, signal))
      .catch((error: unknown) => {
        if (!(error instanceof CancelledError)) console.error(error);
      });
  };

  const handleError = (code: ErrorCode) => {
    if (pending) {
      settle({ ok: false, reason: code });
      return;
    }
    stopAwaiting();
    setState({ isRolling: false });
    if (code === "INVALID_REJOIN") void storage.clearSession();
    const key = errorMessageKey(code);
    if (key) toast({ key });
  };

  const handleMessage = (message: ServerMessage) => {
    switch (message.type) {
      case "pong":
        return;
      case "session": {
        const session: OnlineSession = {
          gameId: message.gameId,
          shortCode: message.shortCode,
          playerId: message.playerId,
          rejoinToken: message.rejoinToken,
        };
        setState({ session });
        void storage.saveSession(session);
        return;
      }
      case "gameState":
        if (!isNewer(latest, message.game)) return;
        latest = message.game;
        enqueue(message);
        return;
      case "error":
        handleError(message.code);
        return;
    }
  };

  socket.onMessage(handleMessage);
  socket.onStatus((status) => {
    setState({ status });
    // Answers to in-flight actions are lost with the connection.
    if (status === "reconnecting") {
      stopAwaiting();
      setState({ isRolling: false });
    }
  });
  socket.onOpen(() => {
    // After a reconnection, reclaim our seat with the private token. Lobby requests
    // send their own first message instead.
    const { session } = getState();
    if (!pending && session && latest?.status !== "GAME_OVER") {
      socket.send({
        action: "rejoinGame",
        payload: { gameId: session.gameId, rejoinToken: session.rejoinToken },
      });
    }
  });

  /** Opens the socket, sends `message` and waits for the resulting game snapshot. */
  const request = async (message: ClientMessage): Promise<RequestResult> => {
    settle({ ok: false, reason: "CONNECTION" });
    const result = new Promise<RequestResult>((resolve) => {
      pending = {
        resolve,
        timer: setTimeout(() => settle({ ok: false, reason: "TIMEOUT" }), timings.requestTimeoutMs),
      };
    });
    try {
      await socket.open();
    } catch {
      settle({ ok: false, reason: "CONNECTION" });
    }
    if (pending) socket.send(message);
    const outcome = await result;
    if (!outcome.ok) socket.close();
    return outcome;
  };

  const reset = () => {
    abort.abort();
    abort = new AbortController();
    queue = Promise.resolve();
    latest = null;
    for (const timer of [awaitTimer, retryTimer]) if (timer) clearTimeout(timer);
    awaitTimer = retryTimer = null;
    setState({ ...createOnlineInitialState(), status: socket.status });
  };

  return {
    createGame(displayName: string) {
      reset();
      return request({ action: "createGame", payload: { displayName } });
    },

    joinGame(displayName: string, shortCode: string) {
      reset();
      return request({ action: "joinGame", payload: { displayName, shortCode } });
    },

    /** Reclaims a game interrupted by an app restart. Resolves false when there is none. */
    async resume(): Promise<boolean> {
      const session = await storage.getSession();
      if (!session) return false;
      reset();
      setState({ session });
      const result = await request({
        action: "rejoinGame",
        payload: { gameId: session.gameId, rejoinToken: session.rejoinToken },
      });
      if (!result.ok) {
        await storage.clearSession();
        reset();
      }
      return result.ok;
    },

    pressDice() {
      const { game, isRolling, isPresenting } = getState();
      if (!game || isRolling || isPresenting || !isMyTurn(game, localId())) return;
      if (!ROLL_PHASES.has(game.state.phase)) return;
      const action = game.state.phase === GamePhase.INITIAL_ROLL ? "initialRoll" : "rollDice";
      sendAction({ action }, { rolls: true });
    },

    submitBet(amount: number) {
      const { game } = getState();
      if (!game || !isMyBettingTurn(game, localId())) return;
      const keeps = game.state.phase === GamePhase.POINT_PHASE && amount === game.state.currentBet;
      const sent = sendAction(
        keeps ? { action: "keepBet" } : { action: "placeBet", payload: { amount } },
      );
      if (sent) events.emit({ type: "bet" });
    },

    toggleBetLock() {
      const { game } = getState();
      if (!game || getBettorId(game.state) !== localId()) return;
      socket.send({ action: "setBetLock", payload: { locked: !game.state.betLocked } });
    },

    /** The turn deadline passed: ask the server to apply the default action. */
    expireTurn() {
      const version = latest?.version;
      if (!socket.send({ action: "turnTimeout" })) return;
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = setTimeout(() => {
        retryTimer = null;
        if (latest?.version === version) socket.send({ action: "turnTimeout" });
      }, timings.timeoutRetryMs);
    },

    /** The opponent's reconnect window is over: claim the win. */
    claimAbandonment() {
      socket.send({ action: "claimAbandonment" });
    },

    /** Leaves for good: forfeits a running game, forgets the session and closes the socket. */
    leave() {
      if (latest && latest.status !== "GAME_OVER") socket.send({ action: "leaveGame" });
      settle({ ok: false, reason: "CONNECTION" });
      void storage.clearSession();
      socket.close();
      reset();
    },

    dismissToast() {
      setState({ toastMessage: null });
    },
  };
}

export type OnlineClient = ReturnType<typeof createOnlineClient>;
