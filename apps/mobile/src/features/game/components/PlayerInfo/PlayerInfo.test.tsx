import { PlayerRole } from "@seven/game-core";
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { PlayerInfo } from "@/src/features/game/components/PlayerInfo/PlayerInfo";
import { useSettingsStore } from "@/src/core/settings/settingsStore";

beforeEach(() => useSettingsStore.setState({ language: "en" }));

describe("PlayerInfo", () => {
  it("shows name, role, compact money and winning numbers", async () => {
    await render(
      <PlayerInfo
        id="player1"
        name="Ana"
        currentMoney={1_250_000}
        role={PlayerRole.BETTOR}
        winningNumbers={[2, 3, 12]}
        isActive
      />,
    );
    expect(screen.getByText("Ana")).toBeTruthy();
    expect(screen.getByText("Bet")).toBeTruthy();
    expect(screen.getByText("1.25M")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByLabelText("Ana, Bet, 1.25M")).toBeTruthy();
  });

  it("falls back to the localized seat name and shows rolling before roles exist", async () => {
    useSettingsStore.setState({ language: "es" });
    await render(
      <PlayerInfo id="player2" currentMoney={1_000_000} role={null} winningNumbers={[]} isActive={false} />,
    );
    expect(screen.getByText("Jugador 2")).toBeTruthy();
    expect(screen.getByText("Lanzar")).toBeTruthy();
  });
});
