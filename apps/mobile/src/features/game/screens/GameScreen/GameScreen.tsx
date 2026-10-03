import { GamePhase } from "@seven/game-core";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { illustrations } from "@/src/core/assets/illustrations";
import { AppText } from "@/src/core/components/AppText/AppText";
import { GlassSurface } from "@/src/core/components/GlassSurface/GlassSurface";
import { IconButton } from "@/src/core/components/IconButton/IconButton";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import { useSound } from "@/src/core/hooks/useSound";
import { BetChip } from "@/src/features/game/components/BetChip/BetChip";
import { BetSheet } from "@/src/features/game/components/BetSheet/BetSheet";
import { Dice } from "@/src/features/game/components/Dice/Dice";
import { ExitConfirmModal } from "@/src/features/game/components/ExitConfirmModal/ExitConfirmModal";
import { GameOverScreen } from "@/src/features/game/components/GameOverScreen/GameOverScreen";
import { GameToast } from "@/src/features/game/components/GameToast/GameToast";
import { RollButton } from "@/src/features/game/components/RollButton/RollButton";
import { SeatPanel } from "@/src/features/game/components/SeatPanel/SeatPanel";
import { StatusBanner } from "@/src/features/game/components/StatusBanner/StatusBanner";
import { WinningNumberFlyer } from "@/src/features/game/components/WinningNumberFlyer/WinningNumberFlyer";
import type { GameScreenProps } from "@/src/features/game/screens/GameScreen/GameScreen.types";
import { GameModes } from "@/src/features/game/types";
import { colors } from "@/src/theme/colors";
import { shadows } from "@/src/theme/shadows";
import { MAX_CONTENT_WIDTH, radii, spacing } from "@/src/theme/spacing";

const TOP_VIGNETTE = ["rgba(9,40,42,0.75)", "rgba(9,40,42,0)"] as const;
const BOTTOM_VIGNETTE = ["rgba(9,40,42,0)", "rgba(9,40,42,0.8)"] as const;

/** The table: rival on top, local player at the bottom, dice on the felt in between. */
export const GameScreen: React.FC<GameScreenProps> = ({
  board,
  mode,
  names,
  stats,
  isRolling,
  isDiceEnabled,
  isBetSheetVisible,
  toastMessage,
  statusMessage = null,
  flyer,
  lockableSeats,
  onDicePress,
  onSubmitBet,
  onToggleBetLock,
  onDismissToast,
  onPlayAgain,
  onGoHome,
  onShare,
  captureRef,
  exit,
}) => {
  const { t } = useLanguage();
  const { soundEnabled, setSoundEnabled } = useSound();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isOnline = mode === GameModes.ONLINE;

  const { player1, player2, bettorId, activePlayerId, currentBet, betLocked, maxBet } = board;
  const isInitialPhase = board.phase === GamePhase.INITIAL_ROLL;
  const isGameOver = board.phase === GamePhase.GAME_OVER;
  const bettor = bettorId === "player1" ? player1 : bettorId === "player2" ? player2 : null;
  const canLockBet = bettorId ? lockableSeats[bettorId === "player1" ? "bottom" : "top"] : false;
  const bottomLabel = isOnline ? t("game.you", { name: names.player1 }) : names.player1;
  const waitingLabel =
    !isRolling && activePlayerId ? t("game.turnOf", { name: names[activePlayerId] }) : null;
  const diceSize = height < 720 ? 88 : 108;

  return (
    <View style={styles.root}>
      <Image source={illustrations.table} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
      <LinearGradient colors={TOP_VIGNETTE} style={[styles.vignette, styles.top]} pointerEvents="none" />
      <LinearGradient colors={BOTTOM_VIGNETTE} style={[styles.vignette, styles.bottom]} pointerEvents="none" />

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={styles.topBar}>
          <IconButton strong icon="close" accessibilityLabel={t("game.a11y.exitButton")} onPress={exit.onPress} />
          <GlassSurface strong style={styles.round}>
            <AppText variant="eyebrow" tone="light" style={styles.roundText}>
              {t("game.round", { round: board.totalRounds + 1 })}
            </AppText>
          </GlassSurface>
          <IconButton
            strong
            icon={soundEnabled ? "volume-high-outline" : "volume-mute-outline"}
            accessibilityLabel={t(soundEnabled ? "game.a11y.mute" : "game.a11y.unmute")}
            onPress={() => setSoundEnabled(!soundEnabled)}
          />
        </View>

        <StatusBanner message={statusMessage} />

        <SeatPanel
          player={player2}
          label={names.player2}
          variant="glass"
          isInitialPhase={isInitialPhase}
          initialRoll={board.initialRolls.player2}
        />

        <View style={styles.felt}>
          {!isInitialPhase && board.point !== null && (
            <View style={[styles.point, shadows.card]} accessible accessibilityLabel={`${t("game.pointLabel")} ${board.point}`}>
              <AppText variant="eyebrow" tone="dark" style={styles.pointLabel}>
                {t("game.pointLabel")}
              </AppText>
              <AppText variant="heading" tone="dark">
                {board.point}
              </AppText>
            </View>
          )}
          <Dice
            values={board.diceValues}
            isRolling={isRolling}
            onPress={onDicePress}
            disabled={!isDiceEnabled}
            accessibilityLabel={t("game.a11y.rollDice")}
            size={diceSize}
          />
          <View style={styles.message}>
            <GameToast message={toastMessage} onDismiss={onDismissToast} />
          </View>
          {!isInitialPhase && !isGameOver && currentBet > 0 && (
            <BetChip
              amount={currentBet}
              locked={betLocked}
              canToggle={canLockBet}
              lockPermanent={betLocked && currentBet >= maxBet}
              onToggleLock={onToggleBetLock}
            />
          )}
        </View>

        <SeatPanel
          player={player1}
          label={bottomLabel}
          variant="sand"
          isInitialPhase={isInitialPhase}
          initialRoll={board.initialRolls.player1}
        />

        <RollButton enabled={isDiceEnabled} onPress={onDicePress} waitingLabel={waitingLabel} />
      </View>

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {flyer && <WinningNumberFlyer key={flyer.key} number={flyer.number} playerId={flyer.playerId} />}
      </View>

      <BetSheet
        visible={isBetSheetVisible}
        player={bettor}
        playerName={bettorId ? names[bettorId] : ""}
        currentBet={currentBet}
        minBet={board.minBet}
        maxBet={maxBet}
        isFirstBet={board.isFirstBet}
        point={board.point}
        betLocked={betLocked}
        canToggleLock={canLockBet}
        onToggleLock={onToggleBetLock}
        onSubmitBet={onSubmitBet}
      />

      <ExitConfirmModal
        visible={exit.visible}
        isOnline={isOnline}
        onConfirm={exit.onConfirm}
        onCancel={exit.onCancel}
      />

      {isGameOver && board.winner && board.loser && (
        <GameOverScreen
          isOnline={isOnline}
          winner={board.winner}
          loser={board.loser}
          winnerName={names[board.winner.id]}
          loserName={names[board.loser.id]}
          totalRounds={board.totalRounds}
          endReason={board.endReason}
          stats={stats}
          primaryLabel={t(isOnline ? "game.over.newGame" : "game.over.rematch")}
          onPrimary={onPlayAgain}
          onShare={onShare}
          onHome={onGoHome}
          captureRef={captureRef}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  vignette: { position: "absolute", left: 0, right: 0, height: 240 },
  top: { top: 0 },
  bottom: { bottom: 0 },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
    gap: 14,
  },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  round: { height: 32, paddingHorizontal: 14, borderRadius: radii.pill, justifyContent: "center" },
  roundText: { fontSize: 12, letterSpacing: 1.5 },
  felt: { flex: 1, alignItems: "center", justifyContent: "center", gap: 18 },
  point: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.sand,
  },
  pointLabel: { letterSpacing: 1.5 },
  message: { minHeight: 42, justifyContent: "center", alignSelf: "stretch" },
});
