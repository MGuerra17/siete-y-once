import { GamePhase, TURN_TIMEOUT_MS, getActivePlayerId } from "@seven/game-core";
import { useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { translateNow } from "@/src/core/i18n/translator";
import { createEmitter } from "@/src/core/utils/emitter";
import { useGoHome } from "@/src/features/game/hooks/useGameExit";
import { useExitConfirm } from "@/src/features/game/hooks/useExitConfirm";
import { useGameHaptics } from "@/src/features/game/hooks/useGameHaptics";
import { useGameSounds } from "@/src/features/game/hooks/useGameSounds";
import { useShareResult } from "@/src/features/game/hooks/useShareResult";
import { useTurnTimer } from "@/src/features/game/hooks/useTurnTimer";
import { buildBoardView } from "@/src/features/game/model/boardView";
import type { GameScreenProps } from "@/src/features/game/screens/GameScreen/GameScreen.types";
import { GameModes, type GameEvent, type PlayerId } from "@/src/features/game/types";
import { createOfflineController } from "@/src/features/offline/engine/offlineController";
import { useOfflineGameStore } from "@/src/features/offline/store/offlineGameStore";

const defaultName = (playerId: PlayerId) =>
  translateNow(playerId === "player1" ? "game.player1DefaultName" : "game.player2DefaultName");

/** Wires the offline controller, timer, sounds and navigation into GameScreen props. */
export const useOfflineGameScreen = (): GameScreenProps => {
  const navigation = useNavigation();
  const goHome = useGoHome();
  const [events] = useState(() => createEmitter<GameEvent>());
  const [controller] = useState(() =>
    createOfflineController({
      getState: useOfflineGameStore.getState,
      setState: useOfflineGameStore.setState,
      events,
      nameOf: defaultName,
    }),
  );
  const state = useOfflineGameStore();

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
    controller.start();
    return () => controller.dispose();
  }, [controller, navigation]);

  useGameSounds(events.subscribe);
  useGameHaptics(events.subscribe);

  const board = useMemo(
    () => buildBoardView(state.core, { localPlayerId: "player1", names: {} }),
    [state.core],
  );
  const exit = useExitConfirm(goHome, controller.restartTurnTimer);
  const { captureRef, share } = useShareResult(board.winner, board.loser, board.totalRounds);

  const activeId = getActivePlayerId(state.core);
  useTurnTimer({
    deadline: exit.isVisible ? null : state.turnDeadline,
    durationMs: TURN_TIMEOUT_MS,
    seat: activeId,
    onExpire: controller.expireTurn,
  });

  const isRollPhase =
    state.core.phase === GamePhase.INITIAL_ROLL ||
    state.core.phase === GamePhase.SHOOTER_ROLLING ||
    state.core.phase === GamePhase.WAITING_FOR_ROLL;

  return {
    board,
    mode: GameModes.OFFLINE,
    names: { player1: defaultName("player1"), player2: defaultName("player2") },
    stats: state.stats,
    isRolling: state.isRolling,
    isDiceEnabled: isRollPhase && !state.isRolling && !state.isProcessing,
    isBetSheetVisible: state.isBetSheetVisible,
    toastMessage: state.toastMessage,
    flyer: state.flyer,
    lockableSeats: { top: true, bottom: true },
    onDicePress: controller.pressDice,
    onSubmitBet: controller.submitBet,
    onToggleBetLock: controller.toggleBetLock,
    onDismissToast: controller.dismissToast,
    onPlayAgain: controller.start,
    onGoHome: goHome,
    onShare: share,
    captureRef,
    exit: { visible: exit.isVisible, onPress: exit.show, onConfirm: exit.confirm, onCancel: exit.hide },
  };
};
