# WebSocket protocol (v2)

Types: `packages/protocol/src/index.ts`. Validation: `apps/backend/src/game/messages.ts`.
All frames are JSON. Client frames: `{ "action": string, "payload"?: object }`.

## Client → server

| Action | Payload | Notes |
|---|---|---|
| `ping` | — | Keep-alive (API Gateway drops idle sockets after 10 min). Replies `pong`. |
| `createGame` | `{ displayName }` | Replies `session` + `gameState(gameCreated)`. |
| `joinGame` | `{ displayName, shortCode }` | Joiner gets `session`; both get `gameState(playerJoined)`. |
| `rejoinGame` | `{ gameId, rejoinToken }` | After a dropped connection. |
| `leaveGame` | — | Forfeits an in-progress game. |
| `initialRoll` / `rollDice` | — | Server rolls the dice. |
| `placeBet` | `{ amount }` | |
| `keepBet` | `{ lock? }` | Point phase only. |
| `setBetLock` | `{ locked }` | Bettor only. |
| `turnTimeout` | — | Ask the server to apply the default action once `turnDeadline` passed. |
| `claimAbandonment` | — | Win once the opponent's `reconnectDeadline` passed. |

## Server → client

- `session` — private to one player: `gameId`, `shortCode`, `playerId`, `rejoinToken`.
- `gameState` — broadcast: `event`, `game: PublicGame`, `outcomes`, `serverTime`.
  Clients must ignore a `game.version` lower than the one they already have.
- `error` — `code` (see `ErrorCode`) and an English `message` for logs. Map codes to i18n.
- `pong` — `serverTime`.

Clock skew: compute deadlines locally as `Date.now() + (deadline - serverTime)`.
