import { GamePhase, TURN_TIMEOUT_MS, getActivePlayerId, getBettorId } from "@seven/game-core";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useGoHome } from "@/src/features/game/hooks/useGameExit";
import { useExitConfirm } from "@/src/features/game/hooks/useExitConfirm";
import { useGameHaptics } from "@/src/features/game/hooks/useGameHaptics";
import { useGameSounds } from "@/src/features/game/hooks/useGameSounds";
import { useShareResult } from "@/src/features/game/hooks/useShareResult";
import { useTurnTimer } from "@/src/features/game/hooks/useTurnTimer";
import { buildBoardView, createSeatMapper, statsInSeats } from "@/src/features/game/model/boardView";
import type { GameScreenProps } from "@/src/features/game/screens/GameScreen/GameScreen.types";
import { GameModes } from "@/src/features/game/types";
import { getOnlineClient, onlineGameEvents } from "@/src/features/online/engine/onlineClientInstance";
import { useOpponentAway } from "@/src/features/online/hooks/useOpponentAway";
import {
  displayNameOf,
  isMyBettingTurn,
  isMyTurn,
  shouldAutoKeepBet,
} from "@/src/features/online/model/presentation";
import { useOnlineGameStore } from "@/src/features/online/store/onlineGameStore";

export type OnlineGameScreenModel = {
  screenProps: GameScreenProps | null;
  /** The game code to share while waiting for the opponent; null once they joined. */
  waitingCode: string | null;
  leave: () => void;
};

/** Projects the online session into GameScreen props and wires the player's actions. */
export const useOnlineGameScreen = (): OnlineGameScreenModel => {
  const navigation = useNavigation();
  const router = useRouter();
  const goHome = useGoHome();
  const { t } = useLanguage();
  const client = getOnlineClient();
  const state = useOnlineGameStore();
  const { game, session, serverOffsetMs } = state;
  const me = session?.playerId ?? "player1";

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
  }, [navigation]);

  useGameSounds(onlineGameEvents.subscribe);
  useGameHaptics(onlineGameEvents.subscribe);

  const leave = useCallback(() => {
    client.leave();
    goHome();
  }, [client, goHome]);

  const playAgain = useCallback(() => {
    client.leave();
    router.replace("/online/lobby");
  }, [client, router]);

  const exit = useExitConfirm(leave);
  const board = useMemo(
    () =>
      game
        ? buildBoardView(game.state, {
            localPlayerId: me,
            names: { player1: displayNameOf(game, "player1"), player2: displayNameOf(game, "player2") },
          })
        : null,
    [game, me],
  );
  const { captureRef, share } = useShareResult(
    board?.winner ?? null,
    board?.loser ?? null,
    board?.totalRounds ?? 0,
  );

  const awaySeconds = useOpponentAway(game, me, serverOffsetMs, client.claimAbandonment);

  const isRunning = game?.status === "IN_PROGRESS" && state.status === "open";
  const activeId = game ? getActivePlayerId(game.state) : null;
  const { toSeat } = createSeatMapper(me);
  useTurnTimer({
    deadline:
      isRunning && game?.turnDeadline != null ? game.turnDeadline - serverOffsetMs : null,
    durationMs: TURN_TIMEOUT_MS,
    seat: activeId ? toSeat(activeId) : null,
    onExpire: client.expireTurn,
  });

  if (!game || !board) return { screenProps: null, waitingCode: null, leave };

  const opponentName = displayNameOf(game, me === "player1" ? "player2" : "player1");
  const statusMessage =
    state.status === "reconnecting"
      ? t("game.banner.reconnecting")
      : awaySeconds !== null
        ? t("game.banner.opponentDisconnected", { name: opponentName, seconds: awaySeconds })
        : null;

  const isRollPhase =
    game.state.phase === GamePhase.INITIAL_ROLL ||
    game.state.phase === GamePhase.SHOOTER_ROLLING ||
    game.state.phase === GamePhase.WAITING_FOR_ROLL;
  const isIdle = !state.isRolling && !state.isPresenting && !state.isAwaitingServer;

  return {
    waitingCode: game.status === "WAITING_PLAYER" ? game.shortCode : null,
    leave,
    screenProps: {
      board,
      mode: GameModes.ONLINE,
      names: { player1: displayNameOf(game, me), player2: opponentName },
      stats: statsInSeats(state.stats, me),
      isRolling: state.isRolling,
      isDiceEnabled: isIdle && isRollPhase && isMyTurn(game, me),
      isBetSheetVisible:
        isIdle && isMyBettingTurn(game, me) && !shouldAutoKeepBet(game, me),
      toastMessage: state.toastMessage,
      statusMessage,
      flyer: state.flyer,
      lockableSeats: { top: false, bottom: getBettorId(game.state) === me },
      onDicePress: client.pressDice,
      onSubmitBet: client.submitBet,
      onToggleBetLock: client.toggleBetLock,
      onDismissToast: client.dismissToast,
      onPlayAgain: playAgain,
      onGoHome: leave,
      onShare: share,
      captureRef,
      exit: { visible: exit.isVisible, onPress: exit.show, onConfirm: exit.confirm, onCancel: exit.hide },
    },
  };
};
