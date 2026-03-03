export interface IGameEngine {
  onDicePress(): void;
  onBetSubmit(amount: number): void;
  onOpenBetSheet(): void;
}
