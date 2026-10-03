import { emptyGameStats, recordRound } from "@/src/features/game/model/gameStats";

describe("gameStats", () => {
  it("counts rounds per winner and keeps the biggest bet", () => {
    let stats = emptyGameStats();
    stats = recordRound(stats, { winnerId: "player1", amount: 100_000 });
    stats = recordRound(stats, { winnerId: "player2", amount: 400_000 });
    stats = recordRound(stats, { winnerId: "player1", amount: 50_000 });

    expect(stats.roundsWon).toEqual({ player1: 2, player2: 1 });
    expect(stats.biggestBet).toBe(400_000);
  });

  it("does not mutate the previous stats", () => {
    const before = emptyGameStats();
    recordRound(before, { winnerId: "player2", amount: 50_000 });
    expect(before).toEqual(emptyGameStats());
  });
});
