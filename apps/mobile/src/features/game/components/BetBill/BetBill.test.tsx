import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { BetBill } from "@/src/features/game/components/BetBill/BetBill";
import { useSettingsStore } from "@/src/core/settings/settingsStore";

beforeEach(() => useSettingsStore.setState({ language: "en" }));

describe("BetBill", () => {
  it("toggles the bet lock", async () => {
    const onToggle = jest.fn();
    await render(<BetBill visible amount={200_000} showLockButton onKeepBetToggle={onToggle} />);
    expect(screen.getByText("200K")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Keep bet locked"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("cannot be unlocked once the bet covers the maximum", async () => {
    const onToggle = jest.fn();
    await render(
      <BetBill visible amount={1_000_000} keepBet showLockButton lockPermanent onKeepBetToggle={onToggle} />,
    );
    fireEvent.press(screen.getByLabelText("Keep bet locked"));
    expect(onToggle).not.toHaveBeenCalled();
  });
});
