import {
  GamePhase,
  getActivePlayerId,
  getBettorId,
  getMaxBet,
  getOpponentId,
  type GameOutcome,
  type PlayerId,
} from "@seven/game-core";
import type { ErrorCode, PublicGame, ServerMessage } from "@seven/protocol";
import type { TranslationKey } from "@/src/core/i18n/translations";
import { describeOutcomes, isRollOutcome, mustAutoKeepBet, type Message } from "@/src/features/game/model/messages";

export type GameStateMessage = Extract<ServerMessage, { type: "gameState" }>;

/** Snapshots can arrive out of order after a reconnection; never go back in time. */
export const isNewer = (current: PublicGame | null, incoming: PublicGame): boolean =>
  current === null || current.gameId !== incoming.gameId || incoming.version > current.version;

export const displayNameOf = (game: PublicGame, playerId: PlayerId): string =>
  game.players[playerId]?.displayName ?? "";

export type MessagePlan = {
  /** Play the dice animation before revealing this snapshot. */
  animateRoll: boolean;
  roundWon: { winnerId: PlayerId; winningSum: number; mine: boolean } | null;
  gameOver: { mine: boolean } | null;
  toast: Message | null;
};

const findOutcome = <K extends GameOutcome["kind"]>(outcomes: readonly GameOutcome[], kind: K) =>
  outcomes.find((o): o is Extract<GameOutcome, { kind: K }> => o.kind === kind);

/** Decides how to present a server snapshot to the local player. Pure, so it is unit-tested. */
export function planGameMessage(message: GameStateMessage, localPlayerId: PlayerId): MessagePlan {
  const { game, outcomes, event } = message;
  const nameOf = (id: PlayerId) => displayNameOf(game, id);
  const roundWon = findOutcome(outcomes, "ROUND_WON");
  const gameOver = findOutcome(outcomes, "GAME_OVER");
  const opponentName = nameOf(getOpponentId(localPlayerId));

  let toast = describeOutcomes(outcomes, game.state, nameOf);
  if (event === "playerReconnected") {
    toast = { key: "game.toast.opponentReconnected" };
  } else if (gameOver?.reason === "FORFEIT" && gameOver.winnerId === localPlayerId) {
    toast =
      event === "playerLeft"
        ? { key: "game.toast.opponentLeft", params: { name: opponentName } }
        : { key: "game.toast.gameOverAbandonment" };
  }

  return {
    animateRoll: isRollOutcome(outcomes),
    roundWon: roundWon
      ? {
          winnerId: roundWon.result.winnerId,
          winningSum: roundWon.result.winningSum,
          mine: roundWon.result.winnerId === localPlayerId,
        }
      : null,
    gameOver: gameOver ? { mine: gameOver.winnerId === localPlayerId } : null,
    toast,
  };
}

/** True when it is the local player's move and both players are seated. */
export const isMyTurn = (game: PublicGame, localPlayerId: PlayerId): boolean =>
  game.status === "IN_PROGRESS" && getActivePlayerId(game.state) === localPlayerId;

export const isMyBettingTurn = (game: PublicGame, localPlayerId: PlayerId): boolean =>
  isMyTurn(game, localPlayerId) &&
  (game.state.phase === GamePhase.BET_PLACEMENT || game.state.phase === GamePhase.POINT_PHASE);

/** The local bettor cannot raise anymore, so the bet is kept without asking. */
export const shouldAutoKeepBet = (game: PublicGame, localPlayerId: PlayerId): boolean =>
  getBettorId(game.state) === localPlayerId &&
  isMyTurn(game, localPlayerId) &&
  mustAutoKeepBet(game.state, getMaxBet(game.state));

const ERROR_KEYS: Partial<Record<ErrorCode, TranslationKey>> = {
  GAME_NOT_FOUND: "online.error.invalidCode",
  GAME_FULL: "online.error.gameFull",
  INVALID_REJOIN: "online.error.rejoinFailed",
  NOT_YOUR_TURN: "online.error.notYourTurn",
  INVALID_BET: "online.error.invalidBet",
};

/** Translation for a server error, or null for errors the player should not see. */
export const errorMessageKey = (code: ErrorCode): TranslationKey | null => {
  if (code === "TOO_EARLY") return null;
  return ERROR_KEYS[code] ?? "online.error.generic";
};
