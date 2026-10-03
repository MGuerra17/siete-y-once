import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import type { TranslationKey } from "@/src/core/i18n/translations";
import { ROLL_DURATION_MS } from "@/src/features/game/constants/game.constants";
import { GamePhase } from "@/src/features/game/enums/GamePhase";
import { useGameStore } from "@/src/features/game/store/gameStore";
import type {
  GameStore,
  GameStoreState,
} from "@/src/features/game/store/gameStore";
import type { PlayerId } from "@/src/features/game/types";
import {
  createOnlineGameEngine,
  type OnlineGameEngine,
} from "@/src/features/online/engine/onlineGameEngine";
import { wsService } from "@/src/features/online/services/WebSocketService";
import { useOnlineStore } from "@/src/features/online/store/onlineStore";
import type {
  ServerGameStateMessage,
  ServerMessage,
} from "@/src/features/online/types/server";
import { mapServerStateToStore } from "@/src/features/online/utils/mapServerState";
import { clearSession, setSession } from "@/src/features/online/utils/storage";

const formatMessage = (
  template: string,
  params: Record<string, string | number>,
): string =>
  Object.entries(params).reduce(
    (msg, [key, value]) => msg.replace(`{${key}}`, String(value)),
    template,
  );

function applyStoreUpdate(
  store: GameStore,
  storeUpdate: Partial<GameStoreState>,
): void {
  if (storeUpdate.phase !== undefined) store.setPhase(storeUpdate.phase);
  if (storeUpdate.diceValues) store.setDiceValues(storeUpdate.diceValues);
  if (storeUpdate.point !== undefined) store.setPoint(storeUpdate.point);
  if (storeUpdate.currentBet !== undefined)
    store.setBet(storeUpdate.currentBet);
  if (storeUpdate.minBet !== undefined)
    store.setMinBet(storeUpdate.minBet);
  if (storeUpdate.totalRounds !== undefined) {
    const diff = storeUpdate.totalRounds - store.totalRounds;
    for (let i = 0; i < diff; i++) store.incrementRounds();
    if (diff > 0) {
      store.setKeepBet(false);
    }
  }
  if (storeUpdate.player1) {
    useGameStore.setState({ player1: storeUpdate.player1 });
  }
  if (storeUpdate.player2) {
    useGameStore.setState({ player2: storeUpdate.player2 });
  }
  if (storeUpdate.shooterId !== undefined) {
    useGameStore.setState({ shooterId: storeUpdate.shooterId });
  }
  if (storeUpdate.bettorId !== undefined) {
    useGameStore.setState({ bettorId: storeUpdate.bettorId });
  }
  if (storeUpdate.initialRolls !== undefined) {
    useGameStore.setState({ initialRolls: storeUpdate.initialRolls });
  }
  if (storeUpdate.activeInitialRollerId !== undefined) {
    useGameStore.setState({
      activeInitialRollerId: storeUpdate.activeInitialRollerId,
    });
  }
  if (storeUpdate.lastWinnerId !== undefined) {
    useGameStore.setState({ lastWinnerId: storeUpdate.lastWinnerId });
  }
  if (storeUpdate.lastWinningNumber !== undefined) {
    useGameStore.setState({
      lastWinningNumber: storeUpdate.lastWinningNumber,
    });
  }
}

function runPostApplyLogic(mySlot: PlayerId): void {
  const freshStore = useGameStore.getState();
  const {
    phase,
    bettorId,
    isBetSheetVisible,
    keepBet,
    currentBet,
    player1,
    player2,
  } = freshStore;
  const isBettor = bettorId === "player1";
  const bettorMoney =
    bettorId === "player1"
      ? player1.currentMoney
      : (player2?.currentMoney ?? 0);
  const maxBet = bettorMoney;
  const shouldNotOpenSheet = keepBet || currentBet >= maxBet;
  if (
    isBettor &&
    !isBetSheetVisible &&
    !shouldNotOpenSheet &&
    (phase === GamePhase.BET_PLACEMENT || phase === GamePhase.POINT_PHASE)
  ) {
    freshStore.openBetSheet();
  }
  if (phase === GamePhase.POINT_PHASE && keepBet && isBettor) {
    wsService.send("keepBet");
  }
}

export const useOnlineGameEngine = (): OnlineGameEngine => {
  const { t } = useLanguage();

  const toast = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const template = t(key as TranslationKey);
      return params ? formatMessage(template, params) : template;
    },
    [t],
  );

  const engine = useMemo(
    () => createOnlineGameEngine(() => useGameStore.getState()),
    [],
  );

  const pendingStoreUpdateRef = useRef<Partial<GameStoreState> | null>(null);
  const pendingMsgRef = useRef<ServerGameStateMessage | null>(null);
  const pendingMySlotRef = useRef<PlayerId | null>(null);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubMessage = wsService.onMessage((data: ServerMessage) => {
      if (data.type === "error") {
        useGameStore.getState().setToastMessage(data.message);
        return;
      }

      const msg = data as ServerGameStateMessage;
      const onlineState = useOnlineStore.getState();
      const mySlot = onlineState.myPlayerSlot;
      const store = useGameStore.getState();

      if (pendingTimeoutRef.current != null) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
        const pendingUpdate = pendingStoreUpdateRef.current;
        const pendingMsg = pendingMsgRef.current;
        const pendingSlot = pendingMySlotRef.current;
        pendingStoreUpdateRef.current = null;
        pendingMsgRef.current = null;
        pendingMySlotRef.current = null;
        if (pendingUpdate != null && pendingMsg != null && pendingSlot != null) {
          applyStoreUpdate(store, pendingUpdate);
          store.setIsRolling(false);
          handleEvent(pendingMsg, toast);
          runPostApplyLogic(pendingSlot);
        }
      }

      if (msg.game && mySlot) {
        const storeUpdate = mapServerStateToStore(msg.game, mySlot);
        const prevRemoteInitialRoll = store.initialRolls.player2;
        const nextRemoteInitialRoll = storeUpdate.initialRolls?.player2;
        const remotePlayerRolled =
          (msg.event === "roll" &&
            storeUpdate.shooterId === "player2") ||
          (msg.event === "initialRoll" &&
            nextRemoteInitialRoll !== undefined &&
            nextRemoteInitialRoll !== prevRemoteInitialRoll) ||
          (msg.event === "roundEnd" &&
            storeUpdate.bettorId === "player2");
        const isBettorViewingRoll = remotePlayerRolled && storeUpdate.diceValues;

        if (isBettorViewingRoll && storeUpdate.diceValues) {
          store.setDiceValues(storeUpdate.diceValues);
          store.setIsRolling(true);
          pendingStoreUpdateRef.current = storeUpdate;
          pendingMsgRef.current = msg;
          pendingMySlotRef.current = mySlot;
          pendingTimeoutRef.current = setTimeout(() => {
            pendingTimeoutRef.current = null;
            const pendingUpdate = pendingStoreUpdateRef.current;
            const pendingMsg = pendingMsgRef.current;
            const pendingSlot = pendingMySlotRef.current;
            pendingStoreUpdateRef.current = null;
            pendingMsgRef.current = null;
            pendingMySlotRef.current = null;
            if (
              pendingUpdate != null &&
              pendingMsg != null &&
              pendingSlot != null
            ) {
              const s = useGameStore.getState();
              applyStoreUpdate(s, pendingUpdate);
              s.setIsRolling(false);
              handleEvent(pendingMsg, toast);
              runPostApplyLogic(pendingSlot);
            }
          }, ROLL_DURATION_MS);
          return;
        }

        applyStoreUpdate(store, storeUpdate);
        store.setIsRolling(false);
      }

      handleEvent(msg, toast);

      if (msg.game && mySlot) {
        runPostApplyLogic(mySlot);
      }
    });

    const unsubClose = wsService.onClose(() => {
      useOnlineStore.getState().setWsConnected(false);
    });

    const unsubOpen = wsService.onOpen(() => {
      useOnlineStore.getState().setWsConnected(true);
      const { gameId, rejoinToken } = useOnlineStore.getState();
      if (gameId && rejoinToken) {
        wsService.send("rejoinGame", { gameId, rejoinToken });
      }
    });

    return () => {
      if (pendingTimeoutRef.current != null) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }
      pendingStoreUpdateRef.current = null;
      pendingMsgRef.current = null;
      pendingMySlotRef.current = null;
      unsubMessage();
      unsubClose();
      unsubOpen();
    };
  }, [toast]);

  return engine;
};

function handleEvent(
  msg: ServerGameStateMessage,
  toast: (key: string, params?: Record<string, string | number>) => string,
): void {
  const store = useGameStore.getState();
  const onlineStore = useOnlineStore.getState();

  switch (msg.event) {
    case "gameCreated": {
      if (msg.gameId && msg.shortCode && msg.rejoinToken) {
        useOnlineStore
          .getState()
          .setSession(msg.gameId, msg.shortCode, msg.rejoinToken, "player1");
        setSession({
          gameId: msg.gameId,
          rejoinToken: msg.rejoinToken,
          myPlayerSlot: "player1",
        });
      }
      break;
    }

    case "joined": {
      if (msg.shortCode && msg.rejoinToken && msg.game) {
        useOnlineStore
          .getState()
          .setSession(
            msg.game.gameId,
            msg.shortCode,
            msg.rejoinToken,
            "player2",
          );
        useOnlineStore.getState().setOpponentConnected(true);
        setSession({
          gameId: msg.game.gameId,
          rejoinToken: msg.rejoinToken,
          myPlayerSlot: "player2",
        });
      }
      break;
    }

    case "playerJoined": {
      useOnlineStore.getState().setOpponentConnected(true);
      break;
    }

    case "rejoined": {
      useOnlineStore.getState().setOpponentConnected(true);
      break;
    }

    case "playerReconnected": {
      useOnlineStore.getState().setOpponentConnected(true);
      store.setToastMessage(toast("game.toast.opponentReconnected"));
      break;
    }

    case "playerDisconnected": {
      useOnlineStore.getState().setOpponentConnected(false);
      store.setToastMessage(toast("game.toast.opponentDisconnected"));
      break;
    }

    case "initialRoll": {
      store.setIsRolling(false);
      break;
    }

    case "betPlaced": {
      const { bettorId } = useGameStore.getState();
      if (bettorId === "player1") {
        store.closeBetSheet();
      }
      break;
    }

    case "keepBet": {
      store.closeBetSheet();
      break;
    }

    case "roll": {
      store.setIsRolling(false);
      break;
    }

    case "roundEnd": {
      store.setIsRolling(false);
      if (msg.roundEnd?.winnerId) {
        const { player1, player2 } = useGameStore.getState();
        const mySlot = onlineStore.myPlayerSlot;
        const needsSwap = mySlot === "player2";
        const winnerServerSlot = msg.roundEnd.winnerId;
        const winnerIsLocal = winnerServerSlot === mySlot;
        const winnerName = winnerIsLocal
          ? (player1.name ?? "You")
          : (player2.name ?? "Opponent");

        const outcome = msg.roundEnd.outcome;
        if (outcome === "SHOOTER_WINS_NATURAL") {
          store.setToastMessage(
            toast("game.toast.shooterWinsNatural", { name: winnerName }),
          );
        } else if (outcome === "BETTOR_WINS_CRAPS") {
          store.setToastMessage(
            toast("game.toast.bettorWinsCraps", { name: winnerName }),
          );
        } else if (outcome === "SHOOTER_WINS_POINT") {
          store.setToastMessage(
            toast("game.toast.shooterWinsPoint", { name: winnerName }),
          );
        } else if (outcome === "BETTOR_WINS_SEVEN") {
          store.setToastMessage(
            toast("game.toast.bettorWinsSeven", { name: winnerName }),
          );
        }

        const localWinnerId = needsSwap
          ? winnerServerSlot === "player1"
            ? "player2"
            : "player1"
          : winnerServerSlot;
        store.setLastWin(
          localWinnerId,
          useGameStore.getState().diceValues[0] +
            useGameStore.getState().diceValues[1],
        );
      }
      break;
    }

    case "gameOverByAbandonment": {
      store.setToastMessage(toast("game.toast.gameOverAbandonment"));
      clearSession();
      break;
    }

    default:
      break;
  }

  if (
    msg.game?.status === "GAME_OVER" &&
    msg.event !== "gameOverByAbandonment"
  ) {
    clearSession();
  }
}
