import { createInitialState, reduce, type GameAction, type GameState } from "@seven/game-core";
import { buildBoardView } from "@/src/features/game/model/boardView";

const play = (state: GameState, ...actions: GameAction[]) =>
  actions.reduce((current, action) => {
    const result = reduce(current, action);
    if (!result.ok) throw new Error(result.error);
    return result.state;
  }, state);

/** player2 won the initial roll: player2 shoots, player1 bets. */
const started = () =>
  play(
    createInitialState(),
    { type: "INITIAL_ROLL", playerId: "player1", dice: [1, 1] },
    { type: "INITIAL_ROLL", playerId: "player2", dice: [6, 6] },
  );

describe("buildBoardView", () => {
  it("seats the local player at the bottom", () => {
    const view = buildBoardView(started(), {
      localPlayerId: "player2",
      names: { player1: "Ana", player2: "Beto" },
    });
    expect(view.player1).toMatchObject({ id: "player1", name: "Beto", currentRole: "SHOOTER" });
    expect(view.player2).toMatchObject({ id: "player2", name: "Ana", currentRole: "BETTOR", isActive: true });
    expect(view.bettorId).toBe("player2");
    expect(view.initialRolls).toEqual({ player1: 12, player2: 2 });
  });

  it("exposes the bet range capped at the lower balance", () => {
    const state: GameState = { ...started(), money: { player1: 1_600_000, player2: 400_000 } };
    const view = buildBoardView(state, { localPlayerId: "player1", names: {} });
    expect(view.minBet).toBe(50_000);
    expect(view.maxBet).toBe(400_000);
    expect(view.isFirstBet).toBe(true);
  });

  it("names the winner and loser once the game is over", () => {
    const over = play(started(), { type: "FORFEIT", playerId: "player1" });
    const view = buildBoardView(over, { localPlayerId: "player1", names: {} });
    expect(view.winner?.id).toBe("player2");
    expect(view.loser?.id).toBe("player1");
  });
});
