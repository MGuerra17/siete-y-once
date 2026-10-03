import type { ServerMessage } from "@seven/protocol";
import {
  VersionConflictError,
  type ConnectionRecord,
  type ConnectionsRepository,
  type Dependencies,
  type GamesRepository,
  type Notifier,
} from "../ports";
import type { ServerGame } from "../session";

export class InMemoryGames implements GamesRepository {
  readonly items = new Map<string, ServerGame>();
  /** Simulates a concurrent writer winning the race this many times. */
  conflictsToSimulate = 0;

  async get(gameId: string) {
    return structuredClone(this.items.get(gameId) ?? null);
  }

  async findWaitingByShortCode(shortCode: string) {
    const game = [...this.items.values()].find(
      (g) => g.shortCode === shortCode && g.status === "WAITING_PLAYER",
    );
    return structuredClone(game ?? null);
  }

  async create(game: ServerGame) {
    this.items.set(game.gameId, structuredClone(game));
  }

  async update(game: ServerGame) {
    const stored = this.items.get(game.gameId);
    if (this.conflictsToSimulate > 0 || stored?.version !== game.version - 1) {
      this.conflictsToSimulate = Math.max(0, this.conflictsToSimulate - 1);
      throw new VersionConflictError(game.gameId);
    }
    this.items.set(game.gameId, structuredClone(game));
  }
}

export class InMemoryConnections implements ConnectionsRepository {
  readonly items = new Map<string, ConnectionRecord>();
  async get(connectionId: string) {
    return this.items.get(connectionId) ?? null;
  }
  async put(record: ConnectionRecord) {
    this.items.set(record.connectionId, record);
  }
  async delete(connectionId: string) {
    this.items.delete(connectionId);
  }
}

export class RecordingNotifier implements Notifier {
  readonly sent: { connectionId: string; message: ServerMessage }[] = [];
  async send(connectionId: string, message: ServerMessage) {
    this.sent.push({ connectionId, message });
  }
  to(connectionId: string) {
    return this.sent.filter((s) => s.connectionId === connectionId).map((s) => s.message);
  }
  last(connectionId: string) {
    return this.to(connectionId).at(-1);
  }
  clear() {
    this.sent.length = 0;
  }
}

export function createFakeDependencies() {
  let time = 1_000_000;
  let counter = 0;
  /** Queue of uniform values consumed by dice rolls; falls back to 0 (a roll of 1). */
  const randomQueue: number[] = [];

  const deps = {
    games: new InMemoryGames(),
    connections: new InMemoryConnections(),
    notifier: new RecordingNotifier(),
    clock: { now: () => time },
    ids: {
      gameId: () => `00000000-0000-4000-8000-00000000000${++counter}`,
      rejoinToken: () => `token-${++counter}-abcdefghijklmnop`,
      shortCode: () => `CODE${String(++counter).padStart(2, "0")}`,
      hash: (value: string) => `hash(${value})`,
    },
    random: { next: () => randomQueue.shift() ?? 0 },
  } satisfies Dependencies;

  return {
    deps,
    advance: (ms: number) => {
      time += ms;
    },
    /** Makes the next roll produce exactly these dice. */
    queueDice: (a: number, b: number) => {
      randomQueue.push((a - 1) / 6, (b - 1) / 6);
    },
  };
}
