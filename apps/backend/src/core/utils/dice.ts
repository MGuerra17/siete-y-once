/** Returns a random integer between 1 and 6 (inclusive). */
export function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/** Rolls two dice and returns the pair. */
export function rollDice(): [number, number] {
  return [rollDie(), rollDie()];
}

/** Returns the sum of two dice values. */
export function diceSum(values: [number, number]): number {
  return values[0] + values[1];
}
