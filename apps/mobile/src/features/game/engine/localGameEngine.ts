import { RESULT_DELAY_MS, ROLL_DURATION_MS } from "@/src/features/game/constants/game.constants";
import { GamePhase } from "@/src/features/game/enums/GamePhase";
import { RoundOutcome } from "@/src/features/game/enums/RoundOutcome";
import type { GameStore } from "@/src/features/game/store/gameStore";
import type { PlayerId } from "@/src/features/game/types";
import {
  delay,
  evaluateFirstRoll,
  evaluateSubsequentRoll,
  getOpponentId,
  getPlayerName,
  isPlayerBroke,
  rollDice,
} from "@/src/features/game/utils/gameUtils";

type ToastFn = (key: string, params?: Record<string, string | number>) => string;

// ---------------------------------------------------------------------------
// Shared helpers used by multiple engine flows
// ---------------------------------------------------------------------------

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
  if (isPlayerBroke(player1.currentMoney, minBet) || isPlayerBroke(player2.currentMoney, minBet)) {
    store.setPhase(GamePhase.GAME_OVER);
    return true;
  }
  return false;
};

/** Activates the shooter, deactivates the bettor, shows the roll toast, and transitions phase. */
const activateShooterForRoll = (
  store: GameStore,
  shooterId: PlayerId,
  toast: ToastFn,
  nextPhase: GamePhase,
): void => {
  const name = getPlayerName(store, shooterId);
  store.setToastMessage(toast("game.toast.shooterRoll", { name }));
  store.setPlayerActive(shooterId, true);
  store.setPlayerActive(getOpponentId(shooterId), false);
  store.setPhase(nextPhase);
};

/**
 * After a non-winning roll during the point phase, either keeps the bet and
 * lets the shooter roll again, or reopens the bet sheet for the bettor.
 */
const handleKeepBetOrReopen = (
  store: GameStore,
  shooterId: PlayerId,
  bettorId: PlayerId,
  toast: ToastFn,
): void => {
  if (store.keepBet) {
    activateShooterForRoll(store, shooterId, toast, GamePhase.WAITING_FOR_ROLL);
  } else {
    const name = getPlayerName(store, bettorId);
    store.setToastMessage(toast("game.toast.placeBet", { name }));
    store.openBetSheet();
  }
};

/** Resolves a round win: shows toast, applies payout, and starts the next round. */
const resolveRoundWin = async (
  getStore: () => GameStore,
  winnerId: PlayerId,
  toastKey: string,
  sum: number,
  bet: number,
  toast: ToastFn,
): Promise<void> => {
  const store = getStore();
  const name = getPlayerName(store, winnerId);
  store.setToastMessage(toast(toastKey, { name, amount: bet }));
  store.setLastWin(winnerId, sum);
  store.applyRoundResult(winnerId, bet);
  await delay(RESULT_DELAY_MS);
  await startNextRound(getStore, winnerId, toast);
};

const startNextRound = async (
  getStore: () => GameStore,
  winnerId: PlayerId,
  toast: ToastFn,
): Promise<void> => {
  const store = getStore();
  store.incrementRounds();
  if (checkGameOver(store)) return;
  store.resetForNewRound(winnerId);
  store.setPhase(GamePhase.BET_PLACEMENT);
  await delay(RESULT_DELAY_MS / 2);
  const freshStore = getStore();
  const bettorName = getPlayerName(freshStore, freshStore.bettorId!);
  freshStore.setToastMessage(toast("game.toast.placeBet", { name: bettorName }));
  freshStore.openBetSheet();
};

// ---------------------------------------------------------------------------
// Engine factory
// ---------------------------------------------------------------------------

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

    const rollerName = getPlayerName(store, activeInitialRollerId);
    const otherRollerId = getOpponentId(activeInitialRollerId);
    const otherRollerName = getPlayerName(store, otherRollerId);
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

    store.setToastMessage(toast("game.toast.comparingRolls", { name: rollerName, sum }));
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
    const bettorId: PlayerId = getOpponentId(shooterId);

    const s = getStore();
    s.setShooterAndBettor(shooterId, bettorId);
    s.setToastMessage(toast("game.toast.shooterDetermined", { name: getPlayerName(s, shooterId) }));
    await delay(RESULT_DELAY_MS);

    const s2 = getStore();
    s2.setPhase(GamePhase.BET_PLACEMENT);
    s2.setToastMessage(toast("game.toast.placeBet", { name: getPlayerName(s2, bettorId) }));
    s2.openBetSheet();
    s2.setIsProcessing(false);
  };

  const handleShooterRoll = async (): Promise<void> => {
    const store = getStore();
    store.setIsProcessing(true);

    const [d1, d2] = await performRoll(store);
    const sum = d1 + d2;

    const s = getStore();
    const { phase, point, currentBet, shooterId, bettorId } = s;

    if (phase === GamePhase.SHOOTER_ROLLING) {
      const outcome = evaluateFirstRoll(sum);

      if (outcome === RoundOutcome.SHOOTER_WINS_NATURAL) {
        await resolveRoundWin(getStore, shooterId!, "game.toast.shooterWinsNatural", sum, currentBet, toast);
      } else if (outcome === RoundOutcome.BETTOR_WINS_CRAPS) {
        await resolveRoundWin(getStore, bettorId!, "game.toast.bettorWinsCraps", sum, currentBet, toast);
      } else {
        s.setPoint(sum);
        s.setPlayerWinningNumbers(shooterId!, [sum]);
        s.setPlayerWinningNumbers(bettorId!, [7]);
        s.setToastMessage(toast("game.toast.pointSet", { point: sum }));
        await delay(RESULT_DELAY_MS);
        const fresh = getStore();
        fresh.setPhase(GamePhase.POINT_PHASE);
        handleKeepBetOrReopen(fresh, shooterId!, bettorId!, toast);
        getStore().setIsProcessing(false);
        return;
      }
    } else {
      const outcome = evaluateSubsequentRoll(sum, point!);

      if (outcome === RoundOutcome.SHOOTER_WINS_POINT) {
        await resolveRoundWin(getStore, shooterId!, "game.toast.shooterWinsPoint", sum, currentBet, toast);
      } else if (outcome === RoundOutcome.BETTOR_WINS_SEVEN) {
        await resolveRoundWin(getStore, bettorId!, "game.toast.bettorWinsSeven", sum, currentBet, toast);
      } else {
        s.setToastMessage(toast("game.toast.continueRolling", { sum }));
        await delay(RESULT_DELAY_MS);
        const fresh = getStore();
        fresh.setPhase(GamePhase.POINT_PHASE);
        handleKeepBetOrReopen(fresh, shooterId!, bettorId!, toast);
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
    if (phase === GamePhase.SHOOTER_ROLLING || phase === GamePhase.WAITING_FOR_ROLL) {
      handleShooterRoll();
    }
  };

  const onBetSubmit = (amount: number): void => {
    const store = getStore();
    store.setBet(amount);
    store.closeBetSheet();

    const { phase, shooterId } = store;
    if (!shooterId) return;

    if (phase === GamePhase.BET_PLACEMENT) {
      activateShooterForRoll(store, shooterId, toast, GamePhase.SHOOTER_ROLLING);
    } else if (phase === GamePhase.POINT_PHASE) {
      activateShooterForRoll(store, shooterId, toast, GamePhase.WAITING_FOR_ROLL);
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
