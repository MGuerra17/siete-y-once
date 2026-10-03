/**
 * Progress of a turn countdown in [0, 1] (0 = full time left, 1 = expired).
 * Time beyond `durationMs` (e.g. a server buffer for animations) keeps the ring full.
 */
export const countdownProgress = (deadline: number, durationMs: number, now: number): number => {
  const remaining = deadline - now;
  return Math.min(1, Math.max(0, 1 - remaining / durationMs));
};

/** Whole seconds left until `deadline`, never negative. */
export const secondsLeft = (deadline: number, now: number): number =>
  Math.max(0, Math.ceil((deadline - now) / 1000));
