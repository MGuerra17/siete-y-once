import { create } from "zustand";
import { INITIAL_MONEY, MIN_BET } from "../constants/game.constants";
import { GamePhase } from "../enums/GamePhase";
import { PlayerRole } from "../enums/PlayerRole";
import type { Player, PlayerId } from "../types";

export type GameStoreState = {
  phase: GamePhase;
  player1: Player;
  player2: Player;
  shooterId: PlayerId | null;
  bettorId: PlayerId | null;
  currentBet: number;
  minBet: number;
  point: number | null;
  diceValues: [number, number];
  isRolling: boolean;
  isProcessing: boolean;
  isBetSheetVisible: boolean;
  toastMessage: string | null;
  totalRounds: number;
  initialRolls: Partial<Record<PlayerId, number>>;
  activeInitialRollerId: PlayerId | null;
};

type GameStoreActions = {
  setPhase: (phase: GamePhase) => void;
  setIsRolling: (value: boolean) => void;
  setIsProcessing: (value: boolean) => void;
  setDiceValues: (values: [number, number]) => void;
  setToastMessage: (message: string | null) => void;
  setPoint: (point: number | null) => void;
  setInitialRoll: (playerId: PlayerId, sum: number) => void;
  resetInitialRolls: () => void;
  setActiveInitialRoller: (playerId: PlayerId | null) => void;
  setShooterAndBettor: (shooterId: PlayerId, bettorId: PlayerId) => void;
  openBetSheet: () => void;
  closeBetSheet: () => void;
  setBet: (amount: number) => void;
  setMinBet: (amount: number) => void;
  setPlayerActive: (playerId: PlayerId, active: boolean) => void;
  setPlayerWinningNumbers: (playerId: PlayerId, numbers: number[]) => void;
  setPlayerRole: (playerId: PlayerId, role: PlayerRole) => void;
  applyRoundResult: (winnerId: PlayerId, bet: number) => void;
  incrementRounds: () => void;
  resetForNewRound: (newShooterId: PlayerId) => void;
  resetGame: () => void;
};

export type GameStore = GameStoreState & GameStoreActions;

const createInitialPlayer = (id: PlayerId, role: PlayerRole): Player => ({
  id,
  name: undefined,
  imageUri: null,
  currentMoney: INITIAL_MONEY,
  currentRole: role,
  winningNumbers: [],
  isActive: false,
});

const createInitialState = (): GameStoreState => ({
  phase: GamePhase.INITIAL_ROLL,
  player1: createInitialPlayer("player1", PlayerRole.BETTER),
  player2: createInitialPlayer("player2", PlayerRole.ROLLER),
  shooterId: null,
  bettorId: null,
  currentBet: MIN_BET,
  minBet: MIN_BET,
  point: null,
  diceValues: [1, 1],
  isRolling: false,
  isProcessing: false,
  isBetSheetVisible: false,
  toastMessage: null,
  totalRounds: 0,
  initialRolls: {},
  activeInitialRollerId: "player1",
});

const updatePlayer = (
  state: GameStoreState,
  playerId: PlayerId,
  patch: Partial<Player>,
): Pick<GameStoreState, "player1" | "player2"> => ({
  player1: playerId === "player1" ? { ...state.player1, ...patch } : state.player1,
  player2: playerId === "player2" ? { ...state.player2, ...patch } : state.player2,
});

export const useGameStore = create<GameStore>((set, get) => ({
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
    set((state) => ({
      activeInitialRollerId: playerId,
      ...updatePlayer(state, "player1", { isActive: playerId === "player1" }),
      ...updatePlayer(state, "player2", { isActive: playerId === "player2" }),
    })),

  setShooterAndBettor: (shooterId, bettorId) =>
    set((state) => {
      const shooterRole = PlayerRole.ROLLER;
      const bettorRole = PlayerRole.BETTER;
      return {
        shooterId,
        bettorId,
        player1: {
          ...state.player1,
          currentRole: state.player1.id === shooterId ? shooterRole : bettorRole,
          isActive: state.player1.id === bettorId,
          winningNumbers: state.player1.id === shooterId ? [7, 11] : [2, 3, 12],
        },
        player2: {
          ...state.player2,
          currentRole: state.player2.id === shooterId ? shooterRole : bettorRole,
          isActive: state.player2.id === bettorId,
          winningNumbers: state.player2.id === shooterId ? [7, 11] : [2, 3, 12],
        },
      };
    }),

  openBetSheet: () =>
    set((state) => ({
      isBetSheetVisible: true,
      currentBet: state.minBet,
    })),

  closeBetSheet: () => set({ isBetSheetVisible: false }),

  setBet: (amount) => set({ currentBet: amount }),

  setMinBet: (amount) => set({ minBet: amount }),

  setPlayerActive: (playerId, active) =>
    set((state) => ({ ...updatePlayer(state, playerId, { isActive: active }) })),

  setPlayerWinningNumbers: (playerId, numbers) =>
    set((state) => ({ ...updatePlayer(state, playerId, { winningNumbers: numbers }) })),

  setPlayerRole: (playerId, role) =>
    set((state) => ({ ...updatePlayer(state, playerId, { currentRole: role }) })),

  applyRoundResult: (winnerId, bet) =>
    set((state) => {
      const loserId: PlayerId = winnerId === "player1" ? "player2" : "player1";
      const loser = state[loserId];
      const actualPayout = Math.min(bet, loser.currentMoney);
      return {
        ...updatePlayer(state, winnerId, {
          currentMoney: state[winnerId].currentMoney + actualPayout,
        }),
        ...updatePlayer(state, loserId, {
          currentMoney: loser.currentMoney - actualPayout,
        }),
      };
    }),

  incrementRounds: () => set((state) => ({ totalRounds: state.totalRounds + 1 })),

  resetForNewRound: (newShooterId) =>
    set((state) => {
      const newBettorId: PlayerId = newShooterId === "player1" ? "player2" : "player1";
      return {
        point: null,
        currentBet: state.minBet,
        isBetSheetVisible: false,
        shooterId: newShooterId,
        bettorId: newBettorId,
        player1: {
          ...state.player1,
          currentRole: state.player1.id === newShooterId ? PlayerRole.ROLLER : PlayerRole.BETTER,
          isActive: state.player1.id === newBettorId,
          winningNumbers: state.player1.id === newShooterId ? [7, 11] : [2, 3, 12],
        },
        player2: {
          ...state.player2,
          currentRole: state.player2.id === newShooterId ? PlayerRole.ROLLER : PlayerRole.BETTER,
          isActive: state.player2.id === newBettorId,
          winningNumbers: state.player2.id === newShooterId ? [7, 11] : [2, 3, 12],
        },
      };
    }),

  resetGame: () => set(createInitialState()),
}));
