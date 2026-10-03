import { act, render, screen } from "@testing-library/react-native";
import React from "react";
import { GameToast } from "@/src/features/game/components/GameToast/GameToast";

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("GameToast", () => {
  it("announces the message and dismisses itself after the duration", async () => {
    const onDismiss = jest.fn();
    await render(<GameToast message="Point is 6!" duration={3_000} onDismiss={onDismiss} />);
    expect(screen.getByLabelText("Point is 6!")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(2_999);
    });
    expect(onDismiss).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders nothing without a message", async () => {
    await render(<GameToast message={null} />);
    expect(screen.toJSON()).toBeNull();
  });
});
