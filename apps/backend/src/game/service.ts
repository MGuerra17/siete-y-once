import { rollDice, type GameAction, type GameOutcome, type PlayerId } from "@seven/game-core";
import type { ClientMessage, ErrorCode, ServerEvent, ServerMessage } from "@seven/protocol";
import { VersionConflictError, type Dependencies } from "./ports";
import {
  applyPlayerAction,
  applyTurnTimeout,
  claimAbandonment,
  createServerGame,
  findPlayerByConnection,
  findPlayerByTokenHash,
  forfeit,
  getConnectionIds,
  joinServerGame,
  markDisconnected,
  markReconnected,
  toPublicGame,
  type ServerGame,
  type SessionResult,
} from "./session";

const SHORT_CODE_ATTEMPTS = 5;

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  BAD_REQUEST: "Malformed or unknown message",
  NOT_IN_GAME: "You are not in a game",
  ALREADY_IN_GAME: "You are already in a game",
  GAME_NOT_FOUND: "Game not found or expired",
  GAME_FULL: "This game already has two players",
  INVALID_REJOIN: "Cannot rejoin this game",
  NOT_YOUR_TURN: "It is not your turn",
  WRONG_PHASE: "That action is not allowed right now",
  INVALID_BET: "Invalid bet amount",
  TOO_EARLY: "Too early",
  CONFLICT: "The game changed, please retry",
  INTERNAL: "Internal error",
};

/** Handles WebSocket lifecycle events and client messages. Framework-free and fully injectable. */
export class GameService {
  constructor(private readonly deps: Dependencies) {}

  async onConnect(connectionId: string): Promise<void> {
    await this.deps.connections.put({ connectionId, gameId: null, playerId: null });
  }

  async onDisconnect(connectionId: string): Promise<void> {
    const connection = await this.deps.connections.get(connectionId);
    await this.deps.connections.delete(connectionId);
    if (!connection?.gameId) return;

    await this.mutateGame(connection.gameId, (game, now) => {
      const playerId = findPlayerByConnection(game, connectionId);
      if (!playerId || game.status === "GAME_OVER") return null;
      return { ok: true, game: markDisconnected(game, playerId, now), outcomes: [] };
    }, "playerDisconnected");
  }

  /** Tells the client something went wrong on our side, without leaking details. */
  reportInternalError(connectionId: string): Promise<void> {
    return this.sendError(connectionId, "INTERNAL");
  }

  async onMessage(connectionId: string, message: ClientMessage | null): Promise<void> {
    if (!message) return this.sendError(connectionId, "BAD_REQUEST");

    switch (message.action) {
      case "ping":
        return this.send(connectionId, { type: "pong", serverTime: this.deps.clock.now() });
      case "createGame":
        return this.createGame(connectionId, message.payload.displayName);
      case "joinGame":
        return this.joinGame(connectionId, message.payload.displayName, message.payload.shortCode);
      case "rejoinGame":
        return this.rejoinGame(connectionId, message.payload.gameId, message.payload.rejoinToken);
      case "leaveGame":
        return this.leaveGame(connectionId);
      case "initialRoll":
        return this.playerAction(connectionId, (playerId) => ({
          type: "INITIAL_ROLL",
          playerId,
          dice: this.roll(),
        }));
      case "placeBet":
        return this.playerAction(connectionId, (playerId) => ({
          type: "PLACE_BET",
          playerId,
          amount: message.payload.amount,
        }));
      case "keepBet":
        return this.playerAction(connectionId, (playerId) => ({
          type: "KEEP_BET",
          playerId,
          lock: message.payload?.lock,
        }));
      case "setBetLock":
        return this.playerAction(connectionId, (playerId) => ({
          type: "SET_BET_LOCK",
          playerId,
          locked: message.payload.locked,
        }));
      case "rollDice":
        return this.playerAction(connectionId, (playerId) => ({
          type: "ROLL",
          playerId,
          dice: this.roll(),
        }));
      case "turnTimeout":
        return this.inGame(connectionId, "turnTimeout", (game, _playerId, now) =>
          applyTurnTimeout(game, this.roll(), now),
        );
      case "claimAbandonment":
        return this.inGame(connectionId, "gameOverByAbandonment", (game, playerId, now) =>
          claimAbandonment(game, playerId, now),
        );
    }
  }

  // ---------------------------------------------------------------------------
  // Lobby
  // ---------------------------------------------------------------------------

  private async createGame(connectionId: string, displayName: string): Promise<void> {
    if (await this.isInActiveGame(connectionId)) {
      return this.sendError(connectionId, "ALREADY_IN_GAME");
    }
    const { ids, clock } = this.deps;
    const shortCode = await this.uniqueShortCode();
    const rejoinToken = ids.rejoinToken();
    const game = createServerGame({
      gameId: ids.gameId(),
      shortCode,
      connectionId,
      displayName,
      rejoinTokenHash: ids.hash(rejoinToken),
      now: clock.now(),
    });

    await this.deps.games.create(game);
    await this.deps.connections.put({ connectionId, gameId: game.gameId, playerId: "player1" });
    await this.sendSession(connectionId, game, "player1", rejoinToken);
    await this.send(connectionId, this.stateMessage(game, "gameCreated", []));
  }

  private async joinGame(connectionId: string, displayName: string, shortCode: string) {
    if (await this.isInActiveGame(connectionId)) {
      return this.sendError(connectionId, "ALREADY_IN_GAME");
    }
    const waiting = await this.deps.games.findWaitingByShortCode(shortCode);
    if (!waiting) return this.sendError(connectionId, "GAME_NOT_FOUND");

    const rejoinToken = this.deps.ids.rejoinToken();
    const rejoinTokenHash = this.deps.ids.hash(rejoinToken);
    await this.mutateGame(
      waiting.gameId,
      (game, now) => joinServerGame(game, { connectionId, displayName, rejoinTokenHash }, now),
      "playerJoined",
      {
        errorTo: connectionId,
        beforeBroadcast: (game) => this.registerPlayer(connectionId, game, "player2", rejoinToken),
      },
    );
  }

  private async rejoinGame(connectionId: string, gameId: string, rejoinToken: string) {
    const tokenHash = this.deps.ids.hash(rejoinToken);
    let rejoinedAs: PlayerId | null = null;

    await this.mutateGame(
      gameId,
      (game, now) => {
        const playerId = findPlayerByTokenHash(game, tokenHash);
        if (!playerId || game.status === "GAME_OVER") return { ok: false, error: "INVALID_REJOIN" };
        rejoinedAs = playerId;
        return { ok: true, game: markReconnected(game, playerId, connectionId, now), outcomes: [] };
      },
      "playerReconnected",
      {
        errorTo: connectionId,
        notFound: "INVALID_REJOIN",
        beforeBroadcast: (game) =>
          this.registerPlayer(connectionId, game, rejoinedAs!, rejoinToken),
      },
    );
  }

  private async leaveGame(connectionId: string): Promise<void> {
    const connection = await this.deps.connections.get(connectionId);
    if (!connection?.gameId || !connection.playerId) return;
    const playerId = connection.playerId;
    await this.mutateGame(connection.gameId, (game, now) => forfeit(game, playerId, now), "playerLeft");
    await this.deps.connections.put({ connectionId, gameId: null, playerId: null });
  }

  // ---------------------------------------------------------------------------
  // Gameplay
  // ---------------------------------------------------------------------------

  private playerAction(connectionId: string, buildAction: (playerId: PlayerId) => GameAction) {
    return this.inGame(connectionId, "action", (game, playerId, now) =>
      applyPlayerAction(game, buildAction(playerId), now),
    );
  }

  /** Resolves the caller's game and seat, then applies `apply` to it. */
  private async inGame(
    connectionId: string,
    event: ServerEvent,
    apply: (game: ServerGame, playerId: PlayerId, now: number) => SessionResult,
  ): Promise<void> {
    const connection = await this.deps.connections.get(connectionId);
    if (!connection?.gameId) return this.sendError(connectionId, "NOT_IN_GAME");

    await this.mutateGame(
      connection.gameId,
      (game, now) => {
        const playerId = findPlayerByConnection(game, connectionId);
        if (!playerId) return { ok: false, error: "NOT_IN_GAME" };
        return apply(game, playerId, now);
      },
      event,
      { errorTo: connectionId },
    );
  }

  /**
   * Read-modify-write with optimistic concurrency: if another request updated the game
   * in between, the mutation is retried once against the fresh copy.
   */
  private async mutateGame(
    gameId: string,
    mutate: (game: ServerGame, now: number) => SessionResult | null,
    event: ServerEvent,
    options: {
      errorTo?: string;
      notFound?: ErrorCode;
      beforeBroadcast?: (game: ServerGame) => Promise<void>;
    } = {},
  ): Promise<ServerGame | null> {
    for (let attempt = 0; attempt < 2; attempt++) {
      const game = await this.deps.games.get(gameId);
      if (!game) {
        if (options.errorTo) await this.sendError(options.errorTo, options.notFound ?? "GAME_NOT_FOUND");
        return null;
      }
      const result = mutate(game, this.deps.clock.now());
      if (!result) return null;
      if (!result.ok) {
        // TOO_EARLY is an expected race with the client countdown, not worth surfacing.
        if (options.errorTo && result.error !== "TOO_EARLY") {
          await this.sendError(options.errorTo, result.error);
        }
        return null;
      }

      try {
        await this.deps.games.update(result.game);
      } catch (error) {
        if (error instanceof VersionConflictError && attempt === 0) continue;
        if (error instanceof VersionConflictError) {
          if (options.errorTo) await this.sendError(options.errorTo, "CONFLICT");
          return null;
        }
        throw error;
      }

      await options.beforeBroadcast?.(result.game);
      await this.broadcast(result.game, event, result.outcomes);
      return result.game;
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private roll() {
    return rollDice(() => this.deps.random.next());
  }

  private async isInActiveGame(connectionId: string): Promise<boolean> {
    const connection = await this.deps.connections.get(connectionId);
    if (!connection?.gameId) return false;
    const game = await this.deps.games.get(connection.gameId);
    return game !== null && game.status !== "GAME_OVER";
  }

  private async uniqueShortCode(): Promise<string> {
    for (let attempt = 0; attempt < SHORT_CODE_ATTEMPTS; attempt++) {
      const code = this.deps.ids.shortCode();
      if (!(await this.deps.games.findWaitingByShortCode(code))) return code;
    }
    throw new Error("Could not generate a unique short code");
  }

  private async registerPlayer(
    connectionId: string,
    game: ServerGame,
    playerId: PlayerId,
    rejoinToken: string,
  ): Promise<void> {
    await this.deps.connections.put({ connectionId, gameId: game.gameId, playerId });
    await this.sendSession(connectionId, game, playerId, rejoinToken);
  }

  private sendSession(connectionId: string, game: ServerGame, playerId: PlayerId, rejoinToken: string) {
    return this.send(connectionId, {
      type: "session",
      gameId: game.gameId,
      shortCode: game.shortCode,
      playerId,
      rejoinToken,
      serverTime: this.deps.clock.now(),
    });
  }

  private stateMessage(game: ServerGame, event: ServerEvent, outcomes: GameOutcome[]): ServerMessage {
    return {
      type: "gameState",
      event,
      game: toPublicGame(game),
      outcomes,
      serverTime: this.deps.clock.now(),
    };
  }

  private async broadcast(game: ServerGame, event: ServerEvent, outcomes: GameOutcome[]) {
    const message = this.stateMessage(game, event, outcomes);
    await Promise.all(getConnectionIds(game).map((id) => this.send(id, message)));
  }

  private sendError(connectionId: string, code: ErrorCode) {
    return this.send(connectionId, { type: "error", code, message: ERROR_MESSAGES[code] });
  }

  private send(connectionId: string, message: ServerMessage) {
    return this.deps.notifier.send(connectionId, message);
  }
}
