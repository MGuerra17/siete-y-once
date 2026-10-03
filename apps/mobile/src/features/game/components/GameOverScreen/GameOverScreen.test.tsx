import { PlayerRole } from "@seven/game-core";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { GameOverScreen, type GameOverScreenProps } from "@/src/features/game/components/GameOverScreen/GameOverScreen";
import { useSettingsStore } from "@/src/core/settings/settingsStore";
import type { Player } from "@/src/features/game/types";

const seat = (id: Player["id"], money: number): Player => ({
  id,
  currentMoney: money,
  currentRole: PlayerRole.SHOOTER,
  winningNumbers: [],
  isActive: false,
});

const props = (overrides: Partial<GameOverScreenProps> = {}): GameOverScreenProps => ({
  isOnline: true,
  winner: seat("player1", 2_000_000),
  loser: seat("player2", 0),
  winnerName: "Ana",
  loserName: "Beto",
  totalRounds: 12,
  endReason: "BANKRUPT",
  stats: { roundsWon: { player1: 8, player2: 4 }, biggestBet: 400_000 },
  primaryLabel: "Nueva partida",
  onPrimary: jest.fn(),
  onShare: jest.fn(),
  onHome: jest.fn(),
  ...overrides,
});

beforeEach(() => useSettingsStore.setState({ language: "es" }));

describe("GameOverScreen", () => {
  it("celebrates an online win with the final money and the player's stats", async () => {
    await render(<GameOverScreen {...props()} />);
    expect(screen.getByTestId("game-over-win")).toBeTruthy();
    expect(screen.getByText("¡Ganaste, Ana!")).toBeTruthy();
    expect(screen.getByText("$2.000.000")).toBeTruthy();
    expect(screen.getByText("Dejaste a Beto sin plata en 12 rondas")).toBeTruthy();
    expect(screen.getByLabelText("Ganadas: 8")).toBeTruthy();
    expect(screen.getByLabelText("Mayor apuesta: $400K")).toBeTruthy();
  });

  it("shows the calm night variant when the local player loses", async () => {
    await render(
      <GameOverScreen
        {...props({ winner: seat("player2", 2_000_000), loser: seat("player1", 0), winnerName: "Beto", loserName: "Ana" })}
      />,
    );
    expect(screen.getByTestId("game-over-lose")).toBeTruthy();
    expect(screen.getByText("Beto se llevó la mesa")).toBeTruthy();
    expect(screen.getByLabelText("Ganadas: 8")).toBeTruthy();
  });

  it("names the winner offline and offers a rematch", async () => {
    const onPrimary = jest.fn();
    await render(
      <GameOverScreen
        {...props({
          isOnline: false,
          winner: seat("player2", 2_000_000),
          loser: seat("player1", 0),
          winnerName: "Jugador 2",
          loserName: "Jugador 1",
          totalRounds: 1,
          stats: { roundsWon: { player1: 0, player2: 1 }, biggestBet: 1_000_000 },
          primaryLabel: "Revancha",
          onPrimary,
        })}
      />,
    );
    expect(screen.getByText("¡Ganó Jugador 2!")).toBeTruthy();
    expect(screen.getByText("Jugador 2 dejó a Jugador 1 sin plata en 1 ronda")).toBeTruthy();
    expect(screen.getByLabelText("Ganadas: 1")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Revancha"));
    expect(onPrimary).toHaveBeenCalled();
  });
});
