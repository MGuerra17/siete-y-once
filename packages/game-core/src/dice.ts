import type { Dice } from "./types";

/** Returns a float in [0, 1). Injectable so engines can be seeded in tests or use a CSPRNG. */
export type RandomSource = () => number;

export const rollDie = (random: RandomSource = Math.random): number =>
  Math.floor(random() * 6) + 1;

export const rollDice = (random: RandomSource = Math.random): Dice => [
  rollDie(random),
  rollDie(random),
];

export const diceSum = (dice: Dice): number => dice[0] + dice[1];

export const isValidDice = (dice: unknown): dice is Dice =>
  Array.isArray(dice) &&
  dice.length === 2 &&
  dice.every((value) => Number.isInteger(value) && value >= 1 && value <= 6);
