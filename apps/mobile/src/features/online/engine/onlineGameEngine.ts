import type { IGameEngine } from "@/src/features/game/engine/IGameEngine";
import { GamePhase } from "@/src/features/game/enums/GamePhase";
import type { GameStore } from "@/src/features/game/store/gameStore";
import { wsService } from "@/src/features/online/services/WebSocketService";

export interface OnlineGameEngine extends IGameEngine {
  sendKeepBet(): void;
  sendClaimAbandonment(): void;
}

export const createOnlineGameEngine = (
  getStore: () => GameStore,
): OnlineGameEngine => {
  const onDicePress = (): void => {
    const { phase, isProcessing, isRolling } = getStore();
    if (isProcessing || isRolling) return;

    if (phase === GamePhase.INITIAL_ROLL) {
      wsService.send("initialRoll");
    } else if (
      phase === GamePhase.SHOOTER_ROLLING ||
      phase === GamePhase.WAITING_FOR_ROLL
    ) {
      wsService.send("rollDice");
    }
  };

  const onBetSubmit = (amount: number): void => {
    const store = getStore();
    store.closeBetSheet();

    if (store.phase === GamePhase.POINT_PHASE && amount === store.currentBet) {
      wsService.send("keepBet");
    } else {
      wsService.send("placeBet", { amount });
    }
  };

  const onOpenBetSheet = (): void => {
    const store = getStore();
    if (!store.isBetSheetVisible) {
      store.openBetSheet();
    }
  };

  const sendKeepBet = (): void => {
    wsService.send("keepBet");
  };

  const sendClaimAbandonment = (): void => {
    wsService.send("claimAbandonment");
  };

  const performDefaultAction = (): void => {
    const {
      phase,
      isProcessing,
      isRolling,
      isBetSheetVisible,
      minBet,
      keepBet,
    } = getStore();
    if (isProcessing || isRolling) return;

    if (phase === GamePhase.INITIAL_ROLL) {
      wsService.send("initialRoll");
      return;
    }

    if (phase === GamePhase.BET_PLACEMENT && isBetSheetVisible) {
      getStore().closeBetSheet();
      wsService.send("placeBet", { amount: minBet });
      return;
    }

    if (phase === GamePhase.POINT_PHASE) {
      if (keepBet) {
        wsService.send("keepBet");
        return;
      }
      if (isBetSheetVisible) {
        getStore().closeBetSheet();
        wsService.send("keepBet");
        return;
      }
    }

    if (
      phase === GamePhase.SHOOTER_ROLLING ||
      phase === GamePhase.WAITING_FOR_ROLL
    ) {
      wsService.send("rollDice");
    }
  };

  return {
    onDicePress,
    onBetSubmit,
    onOpenBetSheet,
    performDefaultAction,
    sendKeepBet,
    sendClaimAbandonment,
  };
};
