import { GamePhase } from "@/src/features/game/enums/GamePhase";

/** True when the game is in a phase where the dice can be rolled (initial or shooter). */
export const isDiceRollPhase = (phase: GamePhase): boolean =>
  phase === GamePhase.INITIAL_ROLL ||
  phase === GamePhase.SHOOTER_ROLLING ||
  phase === GamePhase.WAITING_FOR_ROLL;

/** True when the game is in the shooter roll or waiting-for-roll phase. */
export const isShooterRollPhase = (phase: GamePhase): boolean =>
  phase === GamePhase.SHOOTER_ROLLING || phase === GamePhase.WAITING_FOR_ROLL;

/** True when the bet sheet can be shown (bet placement or point phase). */
export const isBetPhase = (phase: GamePhase): boolean =>
  phase === GamePhase.BET_PLACEMENT || phase === GamePhase.POINT_PHASE;
