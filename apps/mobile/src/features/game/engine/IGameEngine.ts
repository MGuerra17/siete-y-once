/**
 * Public API exposed by the game engine to the UI layer.
 * Implementations handle dice rolls, bet submission, and phase transitions.
 */
export interface IGameEngine {
  /** Handles a tap on the dice — starts the appropriate roll based on the current phase. */
  onDicePress(): void;
  /** Called when the bettor confirms their bet amount. */
  onBetSubmit(amount: number): void;
  /** Re-opens the bet bottom sheet (e.g. if it was dismissed without submitting). */
  onOpenBetSheet(): void;
  /** Performs the default action for the current phase (e.g. keep bet, roll dice) when timeout expires. */
  performDefaultAction(): void;
}
