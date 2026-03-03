import { RESULT_DELAY_MS, ROLL_DURATION_MS } from "../constants/game.constants";
import { GamePhase } from "../enums/GamePhase";
import { RoundOutcome } from "../enums/RoundOutcome";
import type { GameStore } from "../store/gameStore";
import type { PlayerId } from "../types";
import {
  delay,
  evaluateFirstRoll,
  evaluateSubsequentRoll,
  isPlayerBroke,
  rollDice,
} from "../utils/gameUtils";

type ToastFn = (key: string, params?: Record<string, string | number>) => string;

const performRoll = async (store: GameStore): Promise<[number, number]> => {
  store.setIsRolling(true);
  await delay(ROLL_DURATION_MS);
  const values = rollDice();
  store.setIsRolling(false);
  store.setDiceValues(values);
  return values;
};

const checkGameOver = (store: GameStore): boolean => {
  const { player1, player2, minBet } = store;
  if (isPlayerBroke(player1.currentMoney, minBet)) {
    store.setPhase(GamePhase.GAME_OVER);
    return true;
  }
  if (isPlayerBroke(player2.currentMoney, minBet)) {
    store.setPhase(GamePhase.GAME_OVER);
    return true;
  }
  return false;
};

const startNextRound = async (
  store: GameStore,
  winnerId: PlayerId,
  toast: ToastFn,
): Promise<void> => {
  store.incrementRounds();
  if (checkGameOver(store)) return;
  store.resetForNewRound(winnerId);
  store.setPhase(GamePhase.BET_PLACEMENT);
  await delay(RESULT_DELAY_MS / 2);
  const bettorId = store.bettorId;
  const bettorName = bettorId === "player1" ? store.player1.name || "Player 1" : store.player2.name || "Player 2";
  store.setToastMessage(toast("game.toast.placeBet", { name: bettorName }));
  store.openBetSheet();
};

export const createLocalGameEngine = (
  getStore: () => GameStore,
  toast: ToastFn,
) => {
  const handleInitialRoll = async (): Promise<void> => {
    const store = getStore();
    const { activeInitialRollerId, initialRolls } = store;
    if (!activeInitialRollerId) return;

    store.setIsProcessing(true);
    const [d1, d2] = await performRoll(store);
    const sum = d1 + d2;
    store.setInitialRoll(activeInitialRollerId, sum);

    const rollerName =
      activeInitialRollerId === "player1"
        ? store.player1.name || "Player 1"
        : store.player2.name || "Player 2";

    const otherRollerId: PlayerId =
      activeInitialRollerId === "player1" ? "player2" : "player1";
    const otherRollerName =
      otherRollerId === "player1"
        ? store.player1.name || "Player 1"
        : store.player2.name || "Player 2";

    const alreadyRolled = initialRolls[otherRollerId] !== undefined;

    if (!alreadyRolled) {
      store.setToastMessage(
        toast("game.toast.playerRolled", { name: rollerName, sum, next: otherRollerName }),
      );
      await delay(RESULT_DELAY_MS);
      store.setActiveInitialRoller(otherRollerId);
      store.setIsProcessing(false);
      return;
    }

    const otherSum = initialRolls[otherRollerId]!;

    store.setToastMessage(
      toast("game.toast.comparingRolls", { name: rollerName, sum }),
    );
    await delay(RESULT_DELAY_MS);

    if (sum === otherSum) {
      store.setToastMessage(toast("game.toast.tie"));
      await delay(RESULT_DELAY_MS);
      getStore().resetInitialRolls();
      getStore().setActiveInitialRoller("player1");
      getStore().setIsProcessing(false);
      return;
    }

    const p1Sum = activeInitialRollerId === "player1" ? sum : otherSum;
    const p2Sum = activeInitialRollerId === "player2" ? sum : otherSum;
    const shooterId: PlayerId = p1Sum > p2Sum ? "player1" : "player2";
    const bettorId: PlayerId = shooterId === "player1" ? "player2" : "player1";

    getStore().setShooterAndBettor(shooterId, bettorId);
    const shooterName =
      shooterId === "player1"
        ? getStore().player1.name || "Player 1"
        : getStore().player2.name || "Player 2";
    getStore().setToastMessage(
      toast("game.toast.shooterDetermined", { name: shooterName }),
    );
    await delay(RESULT_DELAY_MS);

    getStore().setPhase(GamePhase.BET_PLACEMENT);
    const bettorName =
      bettorId === "player1"
        ? getStore().player1.name || "Player 1"
        : getStore().player2.name || "Player 2";
    getStore().setToastMessage(
      toast("game.toast.placeBet", { name: bettorName }),
    );
    getStore().openBetSheet();
    getStore().setIsProcessing(false);
  };

  const handleShooterRoll = async (): Promise<void> => {
    const store = getStore();
    store.setIsProcessing(true);

    const [d1, d2] = await performRoll(store);
    const sum = d1 + d2;

    const currentStore = getStore();
    const { phase, point, currentBet, shooterId, bettorId } = currentStore;

    const shooterName =
      shooterId === "player1"
        ? currentStore.player1.name || "Player 1"
        : currentStore.player2.name || "Player 2";
    const bettorName =
      bettorId === "player1"
        ? currentStore.player1.name || "Player 1"
        : currentStore.player2.name || "Player 2";

    if (phase === GamePhase.SHOOTER_ROLLING) {
      const outcome = evaluateFirstRoll(sum);

      if (outcome === RoundOutcome.SHOOTER_WINS_NATURAL) {
        currentStore.setToastMessage(
          toast("game.toast.shooterWinsNatural", { name: shooterName, amount: currentBet }),
        );
        currentStore.setLastWin(shooterId!, sum);
        currentStore.applyRoundResult(shooterId!, currentBet);
        await delay(RESULT_DELAY_MS);
        await startNextRound(getStore(), shooterId!, toast);
      } else if (outcome === RoundOutcome.BETTOR_WINS_CRAPS) {
        currentStore.setToastMessage(
          toast("game.toast.bettorWinsCraps", { name: bettorName, amount: currentBet }),
        );
        currentStore.setLastWin(bettorId!, sum);
        currentStore.applyRoundResult(bettorId!, currentBet);
        await delay(RESULT_DELAY_MS);
        await startNextRound(getStore(), bettorId!, toast);
      } else {
        currentStore.setPoint(sum);
        currentStore.setPlayerWinningNumbers(shooterId!, [sum]);
        currentStore.setPlayerWinningNumbers(bettorId!, [7]);
        currentStore.setToastMessage(
          toast("game.toast.pointSet", { point: sum }),
        );
        await delay(RESULT_DELAY_MS);
        getStore().setPhase(GamePhase.POINT_PHASE);
        const store = getStore();
        if (store.keepBet) {
          const shooterNameNext =
            shooterId === "player1"
              ? store.player1.name || "Player 1"
              : store.player2.name || "Player 2";
          store.setToastMessage(
            toast("game.toast.shooterRoll", { name: shooterNameNext }),
          );
          store.setPlayerActive(shooterId!, true);
          store.setPlayerActive(
            shooterId === "player1" ? "player2" : "player1",
            false,
          );
          store.setPhase(GamePhase.WAITING_FOR_ROLL);
        } else {
          const bettorNameNext =
            bettorId === "player1"
              ? store.player1.name || "Player 1"
              : store.player2.name || "Player 2";
          store.setToastMessage(
            toast("game.toast.placeBet", { name: bettorNameNext }),
          );
          store.openBetSheet();
        }
        getStore().setIsProcessing(false);
        return;
      }
    } else {
      const outcome = evaluateSubsequentRoll(sum, point!);

      if (outcome === RoundOutcome.SHOOTER_WINS_POINT) {
        currentStore.setToastMessage(
          toast("game.toast.shooterWinsPoint", { name: shooterName, amount: currentBet }),
        );
        currentStore.setLastWin(shooterId!, sum);
        currentStore.applyRoundResult(shooterId!, currentBet);
        await delay(RESULT_DELAY_MS);
        await startNextRound(getStore(), shooterId!, toast);
      } else if (outcome === RoundOutcome.BETTOR_WINS_SEVEN) {
        currentStore.setToastMessage(
          toast("game.toast.bettorWinsSeven", { name: bettorName, amount: currentBet }),
        );
        currentStore.setLastWin(bettorId!, sum);
        currentStore.applyRoundResult(bettorId!, currentBet);
        await delay(RESULT_DELAY_MS);
        await startNextRound(getStore(), bettorId!, toast);
      } else {
        currentStore.setToastMessage(
          toast("game.toast.continueRolling", { sum }),
        );
        await delay(RESULT_DELAY_MS);
        getStore().setPhase(GamePhase.POINT_PHASE);
        const store = getStore();
        if (store.keepBet) {
          const shooterNameNext =
            shooterId === "player1"
              ? store.player1.name || "Player 1"
              : store.player2.name || "Player 2";
          store.setToastMessage(
            toast("game.toast.shooterRoll", { name: shooterNameNext }),
          );
          store.setPlayerActive(shooterId!, true);
          store.setPlayerActive(
            shooterId === "player1" ? "player2" : "player1",
            false,
          );
          store.setPhase(GamePhase.WAITING_FOR_ROLL);
        } else {
          const bettorNameNext =
            bettorId === "player1"
              ? store.player1.name || "Player 1"
              : store.player2.name || "Player 2";
          store.setToastMessage(
            toast("game.toast.placeBet", { name: bettorNameNext }),
          );
          store.openBetSheet();
        }
        getStore().setIsProcessing(false);
        return;
      }
    }

    getStore().setIsProcessing(false);
  };

  const onDicePress = (): void => {
    const store = getStore();
    if (store.isProcessing || store.isRolling) return;

    const { phase } = store;
    if (phase === GamePhase.INITIAL_ROLL) {
      handleInitialRoll();
      return;
    }
    if (
      phase === GamePhase.SHOOTER_ROLLING ||
      phase === GamePhase.WAITING_FOR_ROLL
    ) {
      handleShooterRoll();
    }
  };

  const onBetSubmit = (amount: number): void => {
    const store = getStore();
    store.setBet(amount);
    store.closeBetSheet();

    const { phase, shooterId } = store;

    if (phase === GamePhase.BET_PLACEMENT) {
      const shooterName =
        shooterId === "player1"
          ? store.player1.name || "Player 1"
          : store.player2.name || "Player 2";
      store.setToastMessage(
        toast("game.toast.shooterRoll", { name: shooterName }),
      );
      store.setPlayerActive(
        shooterId === "player1" ? "player1" : "player2",
        true,
      );
      store.setPlayerActive(
        shooterId === "player1" ? "player2" : "player1",
        false,
      );
      store.setPhase(GamePhase.SHOOTER_ROLLING);
    } else if (phase === GamePhase.POINT_PHASE) {
      const shooterName =
        shooterId === "player1"
          ? store.player1.name || "Player 1"
          : store.player2.name || "Player 2";
      store.setToastMessage(
        toast("game.toast.shooterRoll", { name: shooterName }),
      );
      store.setPlayerActive(
        shooterId === "player1" ? "player1" : "player2",
        true,
      );
      store.setPlayerActive(
        shooterId === "player1" ? "player2" : "player1",
        false,
      );
      store.setPhase(GamePhase.WAITING_FOR_ROLL);
    }
  };

  const onOpenBetSheet = (): void => {
    const store = getStore();
    if (!store.isBetSheetVisible) {
      store.openBetSheet();
    }
  };

  return { onDicePress, onBetSubmit, onOpenBetSheet };
};
