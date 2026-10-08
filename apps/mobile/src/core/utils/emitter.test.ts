import { createEmitter } from "@/src/core/utils/emitter";

describe("createEmitter", () => {
  it("keeps notifying other listeners when one throws", () => {
    const emitter = createEmitter<number>();
    const received: number[] = [];
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    emitter.subscribe(() => {
      throw new Error("native player released");
    });
    emitter.subscribe((value) => received.push(value));

    expect(() => emitter.emit(7)).not.toThrow();
    expect(received).toEqual([7]);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("stops notifying after unsubscribe", () => {
    const emitter = createEmitter<string>();
    const listener = jest.fn();
    const unsubscribe = emitter.subscribe(listener);
    unsubscribe();
    emitter.emit("roll");
    expect(listener).not.toHaveBeenCalled();
  });
});
