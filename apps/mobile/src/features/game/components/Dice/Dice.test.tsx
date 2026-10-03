import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Dice } from "@/src/features/game/components/Dice/Dice";
import { PIP_LAYOUTS, pipBoxes } from "@/src/features/game/components/Dice/dieLayout";

describe("die layout", () => {
  it.each([1, 2, 3, 4, 5, 6])("draws %i pips for face %i", (face) => {
    expect(PIP_LAYOUTS[face]).toHaveLength(face);
    expect(pipBoxes(face, 100)).toHaveLength(face);
  });

  it("keeps every pip inside the die", () => {
    for (const box of pipBoxes(6, 108)) {
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.top + box.size).toBeLessThanOrEqual(108);
    }
  });

  it("clamps impossible faces", () => {
    expect(pipBoxes(9, 100)).toHaveLength(6);
    expect(pipBoxes(0, 100)).toHaveLength(1);
  });
});

describe("Dice", () => {
  it("shows both faces and rolls on press", async () => {
    const onPress = jest.fn();
    await render(<Dice values={[4, 2]} isRolling={false} onPress={onPress} accessibilityLabel="Roll" />);
    expect(screen.getAllByTestId("die-pip")).toHaveLength(6);
    fireEvent.press(screen.getByLabelText("Roll"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("ignores presses while disabled", async () => {
    const onPress = jest.fn();
    await render(<Dice values={[1, 1]} isRolling={false} onPress={onPress} disabled accessibilityLabel="Roll" />);
    fireEvent.press(screen.getByLabelText("Roll"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
