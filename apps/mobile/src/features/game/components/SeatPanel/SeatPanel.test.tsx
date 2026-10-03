import { PlayerRole } from "@seven/game-core";
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { SeatPanel } from "@/src/features/game/components/SeatPanel/SeatPanel";
import { useSettingsStore } from "@/src/core/settings/settingsStore";
import type { Player } from "@/src/features/game/types";

const player = (overrides: Partial<Player> = {}): Player => ({
  id: "player1",
  name: "Ana",
  currentMoney: 1_250_000,
  currentRole: PlayerRole.BETTOR,
  winningNumbers: [2, 3, 12],
  isActive: true,
  ...overrides,
});

describe("SeatPanel", () => {
  it("shows name, role with winning numbers and full money (es)", async () => {
    useSettingsStore.setState({ language: "es" });
    await render(<SeatPanel player={player()} label="Ana (tú)" variant="sand" isInitialPhase={false} />);
    expect(screen.getByText("Ana (tú)")).toBeTruthy();
    expect(screen.getByText("Apostador · gana con 2, 3 o 12")).toBeTruthy();
    expect(screen.getByText("$1.250.000")).toBeTruthy();
  });

  it("describes the opening roll before roles exist (en)", async () => {
    useSettingsStore.setState({ language: "en" });
    await render(
      <SeatPanel
        player={player({ id: "player2", currentRole: null, winningNumbers: [] })}
        label="Beto"
        variant="glass"
        isInitialPhase
        initialRoll={9}
      />,
    );
    expect(screen.getByText("Opening roll · Rolled 9")).toBeTruthy();
    expect(screen.getByLabelText("Beto. Opening roll · Rolled 9. $1,250,000")).toBeTruthy();
  });
});
