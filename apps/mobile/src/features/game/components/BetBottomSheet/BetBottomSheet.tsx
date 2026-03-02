import { useLanguage } from "@/src/core/hooks/useLanguage";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import { BetControlButton } from "../BetControlButton/BetControlButton";
import { BetSubmitButton } from "../BetSubmitButton/BetSubmitButton";
import { styles } from "./BetBottomSheet.styles";
import type { BetBottomSheetProps } from "./BetBottomSheet.types";

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
  const [sheetBet, setSheetBet] = useState(currentBet);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (!bottomSheetRef.current) {
      return;
    }

    if (visible) {
      setSheetBet(currentBet);
      bottomSheetRef.current.present();
    } else {
      bottomSheetRef.current.dismiss();
    }
  }, [visible, currentBet]);

  const clampBet = (value: number) => {
    "worklet";
    if (value < minBet) return minBet;
    if (value > maxBet) return maxBet;
    return value;
  };

  const handleAdjust = (delta: number) => {
    setSheetBet((prev) => clampBet(prev + delta));
  };

  const canDecreaseBy = (delta: number) => sheetBet - delta >= minBet;
  const canIncreaseBy = (delta: number) => sheetBet + delta <= maxBet;

  const isValidBet = sheetBet >= minBet && sheetBet <= maxBet;

  const primaryCtaLabel = useMemo(() => {
    if (isFirstBet) {
      return t("game.betSheet.firstBetCta");
    }

    if (sheetBet === currentBet) {
      return t("game.betSheet.keepCta");
    }

    return t("game.betSheet.increaseCta");
  }, [currentBet, isFirstBet, sheetBet, t]);

  const renderBackdrop = (backdropProps: any) => (
    <BottomSheetBackdrop
      {...backdropProps}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="none"
    />
  );

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
      // controlled visibility is handled by parent through ref and visible flag
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
          <Text style={styles.amountValue}>{`${sheetBet}k`}</Text>
          <Text style={styles.amountSecondary}>
            {t("game.betSheet.currentBetLabel")}: {currentBet}k
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.primaryRow}>
            <View style={styles.primaryColumn}>
              <BetControlButton
                label="-50k"
                type="decrease"
                disabled={!canDecreaseBy(50)}
                onPress={() => handleAdjust(-50)}
              />
              <View style={styles.secondaryRow}>
                <BetControlButton
                  label="-100k"
                  type="decrease"
                  small
                  disabled={!canDecreaseBy(100)}
                  onPress={() => handleAdjust(-100)}
                />
                <BetControlButton
                  label="-200k"
                  type="decrease"
                  small
                  disabled={!canDecreaseBy(200)}
                  onPress={() => handleAdjust(-200)}
                />
              </View>
            </View>

            <View style={styles.primaryColumn}>
              <BetControlButton
                label="+50k"
                type="increase"
                disabled={!canIncreaseBy(50)}
                onPress={() => handleAdjust(50)}
              />
              <View style={styles.secondaryRow}>
                <BetControlButton
                  label="+100k"
                  type="increase"
                  small
                  disabled={!canIncreaseBy(100)}
                  onPress={() => handleAdjust(100)}
                />
                <BetControlButton
                  label="+200k"
                  type="increase"
                  small
                  disabled={!canIncreaseBy(200)}
                  onPress={() => handleAdjust(200)}
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
