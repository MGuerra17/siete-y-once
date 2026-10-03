import { create } from "zustand";
import { INITIAL_MONEY, MIN_BET } from "@/src/features/game/constants/game.constants";
import { GamePhase } from "@/src/features/game/enums/GamePhase";
import { PlayerRole } from "@/src/features/game/enums/PlayerRole";
import type { Player, PlayerId } from "@/src/features/game/types";

/** All observable game state managed by Zustand. */
export type GameStoreState = {
  phase: GamePhase;
  player1: Player;
  player2: Player;
  shooterId: PlayerId | null;
  bettorId: PlayerId | null;
  currentBet: number;
  minBet: number;
  keepBet: boolean;
  point: number | null;
  diceValues: [number, number];
  isRolling: boolean;
  isProcessing: boolean;
  isBetSheetVisible: boolean;
  toastMessage: string | null;
  totalRounds: number;
  initialRolls: Partial<Record<PlayerId, number>>;
  activeInitialRollerId: PlayerId | null;
  lastWinnerId: PlayerId | null;
  lastWinningNumber: number | null;
};

/** Actions that mutate game state. */
type GameStoreActions = {
  setPhase: (phase: GamePhase) => void;
  setIsRolling: (value: boolean) => void;
  setIsProcessing: (value: boolean) => void;
  setDiceValues: (values: [number, number]) => void;
  setToastMessage: (message: string | null) => void;
  setPoint: (point: number | null) => void;
  /** Records a player's initial-roll sum for shooter determination. */
  setInitialRoll: (playerId: PlayerId, sum: number) => void;
  /** Clears both initial rolls so a new tie-breaking round can start. */
  resetInitialRolls: () => void;
  /** Sets the active roller during the initial-roll phase and toggles isActive. */
  setActiveInitialRoller: (playerId: PlayerId | null) => void;
  /** Assigns shooter/bettor roles, updates winning numbers, and activates the bettor. */
  setShooterAndBettor: (shooterId: PlayerId, bettorId: PlayerId) => void;
  openBetSheet: () => void;
  closeBetSheet: () => void;
  setKeepBet: (value: boolean) => void;
  setBet: (amount: number) => void;
  setMinBet: (amount: number) => void;
  setPlayerActive: (playerId: PlayerId, active: boolean) => void;
  setPlayerWinningNumbers: (playerId: PlayerId, numbers: number[]) => void;
  setPlayerRole: (playerId: PlayerId, role: PlayerRole) => void;
  /** Stores the last round winner and winning dice sum for the WinningNumberFlyer. */
  setLastWin: (winnerId: PlayerId, winningNumber: number) => void;
  /**
   * Transfers money between players. The actual payout is capped at the
   * loser's remaining money so balances never go negative.
   */
  applyRoundResult: (winnerId: PlayerId, bet: number) => void;
  incrementRounds: () => void;
  /**
   * Resets per-round state (point, bet, keepBet, UI flags) and swaps
   * shooter/bettor roles for the next round.
   */
  resetForNewRound: (newShooterId: PlayerId) => void;
  /** Returns the entire store to its initial state. */
  resetGame: () => void;
};

export type GameStore = GameStoreState & GameStoreActions;

const createInitialPlayer = (
  id: PlayerId,
  role: PlayerRole,
  isActive: boolean = false,
): Player => ({
  id,
  name: undefined,
  imageUri: null,
  currentMoney: INITIAL_MONEY,
  currentRole: role,
  winningNumbers: [],
  isActive,
});

const createInitialState = (): GameStoreState => ({
  phase: GamePhase.INITIAL_ROLL,
  player1: createInitialPlayer("player1", PlayerRole.BETTER, true),
  player2: createInitialPlayer("player2", PlayerRole.ROLLER, false),
  shooterId: null,
  bettorId: null,
  currentBet: 0,
  minBet: MIN_BET,
  keepBet: false,
  point: null,
  diceValues: [1, 1],
  isRolling: false,
  isProcessing: false,
  isBetSheetVisible: false,
  toastMessage: null,
  totalRounds: 0,
  initialRolls: {},
  activeInitialRollerId: "player1",
  lastWinnerId: null,
  lastWinningNumber: null,
});

/** Immutably patches one player while leaving the other unchanged. */
const updatePlayer = (
  state: GameStoreState,
  playerId: PlayerId,
  patch: Partial<Player>,
): Pick<GameStoreState, "player1" | "player2"> => ({
  player1:
    playerId === "player1" ? { ...state.player1, ...patch } : state.player1,
  player2:
    playerId === "player2" ? { ...state.player2, ...patch } : state.player2,
});

/**
 * Central Zustand store for all game state.
 * Used imperatively by the game engine (`getState()`) and reactively by components.
 */
export const useGameStore = create<GameStore>((set) => ({
  ...createInitialState(),

  setPhase: (phase) => set({ phase }),

  setIsRolling: (value) => set({ isRolling: value }),

  setIsProcessing: (value) => set({ isProcessing: value }),

  setDiceValues: (values) => set({ diceValues: values }),

  setToastMessage: (message) => set({ toastMessage: message }),

  setPoint: (point) => set({ point }),

  setInitialRoll: (playerId, sum) =>
    set((state) => ({
      initialRolls: { ...state.initialRolls, [playerId]: sum },
    })),

  resetInitialRolls: () => set({ initialRolls: {} }),

  setActiveInitialRoller: (playerId) =>
    set((state) => {
      const p1 = updatePlayer(state, "player1", { isActive: playerId === "player1" });
      const p2 = updatePlayer(state, "player2", { isActive: playerId === "player2" });
      return {
        activeInitialRollerId: playerId,
        player1: p1.player1,
        player2: p2.player2,
      };
    }),

  setShooterAndBettor: (shooterId, bettorId) =>
    set((state) => ({
      shooterId,
      bettorId,
      player1: {
        ...state.player1,
        currentRole: state.player1.id === shooterId ? PlayerRole.ROLLER : PlayerRole.BETTER,
        isActive: state.player1.id === bettorId,
        winningNumbers: state.player1.id === shooterId ? [7, 11] : [2, 3, 12],
      },
      player2: {
        ...state.player2,
        currentRole: state.player2.id === shooterId ? PlayerRole.ROLLER : PlayerRole.BETTER,
        isActive: state.player2.id === bettorId,
        winningNumbers: state.player2.id === shooterId ? [7, 11] : [2, 3, 12],
      },
    })),

  openBetSheet: () => set({ isBetSheetVisible: true }),

  closeBetSheet: () => set({ isBetSheetVisible: false }),

  setKeepBet: (value) => set({ keepBet: value }),

  setBet: (amount) => set({ currentBet: amount }),

  setMinBet: (amount) => set({ minBet: amount }),

  setPlayerActive: (playerId, active) =>
    set((state) => ({
      ...updatePlayer(state, playerId, { isActive: active }),
    })),

  setPlayerWinningNumbers: (playerId, numbers) =>
    set((state) => ({
      ...updatePlayer(state, playerId, { winningNumbers: numbers }),
    })),

  setPlayerRole: (playerId, role) =>
    set((state) => ({
      ...updatePlayer(state, playerId, { currentRole: role }),
    })),

  setLastWin: (winnerId, winningNumber) =>
    set({ lastWinnerId: winnerId, lastWinningNumber: winningNumber }),

  applyRoundResult: (winnerId, bet) =>
    set((state) => {
      const loserId: PlayerId = winnerId === "player1" ? "player2" : "player1";
      const loser = state[loserId];
      const actualPayout = Math.min(bet, loser.currentMoney);
      const winnerUpdate = updatePlayer(state, winnerId, {
        currentMoney: state[winnerId].currentMoney + actualPayout,
      });
      const loserUpdate = updatePlayer(state, loserId, {
        currentMoney: loser.currentMoney - actualPayout,
      });
      return {
        player1: winnerId === "player1" ? winnerUpdate.player1 : loserUpdate.player1,
        player2: winnerId === "player2" ? winnerUpdate.player2 : loserUpdate.player2,
      };
    }),

  incrementRounds: () =>
    set((state) => ({ totalRounds: state.totalRounds + 1 })),

  resetForNewRound: (newShooterId) =>
    set((state) => {
      const newBettorId: PlayerId =
        newShooterId === "player1" ? "player2" : "player1";
      return {
        point: null,
        currentBet: 0,
        keepBet: false,
        isBetSheetVisible: false,
        lastWinnerId: null,
        lastWinningNumber: null,
        shooterId: newShooterId,
        bettorId: newBettorId,
        player1: {
          ...state.player1,
          currentRole:
            state.player1.id === newShooterId ? PlayerRole.ROLLER : PlayerRole.BETTER,
          isActive: state.player1.id === newBettorId,
          winningNumbers:
            state.player1.id === newShooterId ? [7, 11] : [2, 3, 12],
        },
        player2: {
          ...state.player2,
          currentRole:
            state.player2.id === newShooterId ? PlayerRole.ROLLER : PlayerRole.BETTER,
          isActive: state.player2.id === newBettorId,
          winningNumbers:
            state.player2.id === newShooterId ? [7, 11] : [2, 3, 12],
        },
      };
    }),

  resetGame: () => set(createInitialState()),
}));
