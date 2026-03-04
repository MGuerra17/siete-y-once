import { formatMoneyCompact } from "@/src/core/utils/formatMoney";
import { useLanguage } from "@/src/core/hooks/useLanguage";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { BetControlButton } from "@/src/features/game/components/BetControlButton/BetControlButton";
import { BetSubmitButton } from "@/src/features/game/components/BetSubmitButton/BetSubmitButton";
import { BET_STEPS } from "@/src/features/game/constants/game.constants";
import { useBetControls } from "@/src/features/game/hooks/useBetControls";
import { styles } from "@/src/features/game/components/BetBottomSheet/BetBottomSheet.styles";
import type { BetBottomSheetProps } from "@/src/features/game/components/BetBottomSheet/BetBottomSheet.types";

const renderBackdrop = (backdropProps: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...backdropProps}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    pressBehavior="none"
  />
);

export const BetBottomSheet: React.FC<BetBottomSheetProps> = ({
  visible,
  player,
  currentBet,
  minBet,
  maxBet,
  isFirstBet,
  onClose,
  onSubmitBet,
}) => {
  const { t } = useLanguage();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const {
    sheetBet,
    handleAdjust,
    canDecreaseBy,
    canIncreaseBy,
    isValidBet,
    primaryCtaLabel,
    resetTo,
  } = useBetControls({ initialBet: isFirstBet ? minBet : currentBet, minBet, maxBet, isFirstBet, currentBet });

  useEffect(() => {
    if (!bottomSheetRef.current) return;
    if (visible) {
      resetTo(isFirstBet ? minBet : currentBet);
      bottomSheetRef.current.present();
    } else {
      bottomSheetRef.current.dismiss();
    }
  }, [visible, currentBet, isFirstBet, minBet, resetTo]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={false}
      onDismiss={onClose}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.modal}
      backgroundStyle={styles.background}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t("game.betSheet.title")}</Text>
          {player && (
            <View style={styles.playerBadge}>
              <Text style={styles.playerName}>
                {player.name ?? t("game.player1DefaultName")}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>
            {t("game.betSheet.newTotalBetLabel")}
          </Text>
          <Text style={styles.amountValue}>{formatMoneyCompact(sheetBet)}</Text>
          {!isFirstBet && (
            <Text style={styles.amountSecondary}>
              {t("game.betSheet.currentBetLabel")}:{" "}
              {formatMoneyCompact(currentBet)}
            </Text>
          )}
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.primaryRow}>
            <View style={styles.primaryColumn}>
              <BetControlButton
                label={`-${BET_STEPS[0] / 1000}k`}
                type="decrease"
                disabled={!canDecreaseBy(BET_STEPS[0])}
                onPress={() => handleAdjust(-BET_STEPS[0])}
              />
              <View style={styles.secondaryRow}>
                <BetControlButton
                  label={`-${BET_STEPS[1] / 1000}k`}
                  type="decrease"
                  small
                  disabled={!canDecreaseBy(BET_STEPS[1])}
                  onPress={() => handleAdjust(-BET_STEPS[1])}
                />
                <BetControlButton
                  label={`-${BET_STEPS[2] / 1000}k`}
                  type="decrease"
                  small
                  disabled={!canDecreaseBy(BET_STEPS[2])}
                  onPress={() => handleAdjust(-BET_STEPS[2])}
                />
              </View>
            </View>

            <View style={styles.primaryColumn}>
              <BetControlButton
                label={`+${BET_STEPS[0] / 1000}k`}
                type="increase"
                disabled={!canIncreaseBy(BET_STEPS[0])}
                onPress={() => handleAdjust(BET_STEPS[0])}
              />
              <View style={styles.secondaryRow}>
                <BetControlButton
                  label={`+${BET_STEPS[1] / 1000}k`}
                  type="increase"
                  small
                  disabled={!canIncreaseBy(BET_STEPS[1])}
                  onPress={() => handleAdjust(BET_STEPS[1])}
                />
                <BetControlButton
                  label={`+${BET_STEPS[2] / 1000}k`}
                  type="increase"
                  small
                  disabled={!canIncreaseBy(BET_STEPS[2])}
                  onPress={() => handleAdjust(BET_STEPS[2])}
                />
              </View>
            </View>
          </View>
        </View>

        <BetSubmitButton
          label={primaryCtaLabel}
          disabled={!isValidBet}
          onPress={() => {
            if (isValidBet) {
              onSubmitBet(sheetBet);
            }
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};
