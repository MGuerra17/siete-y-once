import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { BetChip } from "@/src/features/game/components/BetChip/BetChip";
import { useSettingsStore } from "@/src/core/settings/settingsStore";

beforeEach(() => useSettingsStore.setState({ language: "en" }));

describe("BetChip", () => {
  it("shows the bet and toggles the lock", async () => {
    const onToggle = jest.fn();
    await render(<BetChip amount={200_000} locked={false} canToggle onToggleLock={onToggle} />);
    expect(screen.getByText("$200,000")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Keep bet locked"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("cannot be unlocked once the bet covers the maximum", async () => {
    const onToggle = jest.fn();
    await render(<BetChip amount={1_000_000} locked canToggle lockPermanent onToggleLock={onToggle} />);
    fireEvent.press(screen.getByLabelText("Keep bet locked"));
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("is read-only for the other player", async () => {
    const onToggle = jest.fn();
    await render(<BetChip amount={50_000} locked={false} canToggle={false} onToggleLock={onToggle} />);
    fireEvent.press(screen.getByLabelText("Keep bet locked"));
    expect(onToggle).not.toHaveBeenCalled();
  });
});
