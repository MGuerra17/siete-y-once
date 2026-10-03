import type { GameStoreState } from "@/src/features/game/store/gameStore";
import type { Player, PlayerId } from "@/src/features/game/types";
import { GamePhase } from "@/src/features/game/enums/GamePhase";
import { PlayerRole } from "@/src/features/game/enums/PlayerRole";
import type { ServerGameState, ServerPlayer } from "@/src/features/online/types/server";

function swapSlot(slot: PlayerId | null): PlayerId | null {
  if (slot === "player1") return "player2";
  if (slot === "player2") return "player1";
  return null;
}

function swapInitialRolls(
  rolls: Partial<Record<PlayerId, number>>,
): Partial<Record<PlayerId, number>> {
  const swapped: Partial<Record<PlayerId, number>> = {};
  if (rolls.player1 !== undefined) swapped.player2 = rolls.player1;
  if (rolls.player2 !== undefined) swapped.player1 = rolls.player2;
  return swapped;
}

function toFrontendPlayer(server: ServerPlayer): Player {
  return {
    id: server.id,
    name: server.displayName,
    imageUri: null,
    currentMoney: server.currentMoney,
    currentRole: server.currentRole as PlayerRole,
    winningNumbers: server.winningNumbers,
    isActive: server.isActive,
  };
}

/**
 * Maps the server GameState to the frontend Zustand store shape.
 * When mySlot is "player2", swaps player1/player2 so the local player
 * is always store.player1 (rendered at the bottom of the screen).
 */
export function mapServerStateToStore(
  serverGame: ServerGameState,
  mySlot: PlayerId,
): Partial<GameStoreState> {
  const needsSwap = mySlot === "player2";

  const serverLocal = needsSwap ? serverGame.player2 : serverGame.player1;
  const serverRemote = needsSwap ? serverGame.player1 : serverGame.player2;

  if (!serverLocal) {
    return {};
  }

  const localPlayer = toFrontendPlayer(serverLocal);
  localPlayer.id = "player1";

  let remotePlayer: Player;
  if (serverRemote) {
    remotePlayer = toFrontendPlayer(serverRemote);
    remotePlayer.id = "player2";
  } else {
    remotePlayer = {
      id: "player2",
      name: undefined,
      imageUri: null,
      currentMoney: 0,
      currentRole: PlayerRole.ROLLER,
      winningNumbers: [],
      isActive: false,
    };
  }

  if (needsSwap) {
    localPlayer.isActive = serverLocal.isActive;
    remotePlayer.isActive = serverRemote?.isActive ?? false;
  }

  return {
    phase: serverGame.phase as GamePhase,
    player1: localPlayer,
    player2: remotePlayer,
    shooterId: needsSwap
      ? swapSlot(serverGame.shooterId)
      : serverGame.shooterId,
    bettorId: needsSwap
      ? swapSlot(serverGame.bettorId)
      : serverGame.bettorId,
    currentBet: serverGame.currentBet,
    minBet: serverGame.minBet,
    keepBet: serverGame.keepBet,
    point: serverGame.point,
    diceValues: serverGame.diceValues,
    totalRounds: serverGame.totalRounds,
    initialRolls: needsSwap
      ? swapInitialRolls(serverGame.initialRolls)
      : serverGame.initialRolls,
    activeInitialRollerId: needsSwap
      ? swapSlot(serverGame.activeInitialRollerId)
      : serverGame.activeInitialRollerId,
    lastWinnerId: needsSwap
      ? swapSlot(serverGame.lastWinnerId)
      : serverGame.lastWinnerId,
    lastWinningNumber: serverGame.lastWinningNumber,
  };
}
