# Architecture

```
packages/game-core  ──►  apps/mobile (offline engine, UI selectors)
        │
        └──────────────►  apps/backend (authoritative online engine)
packages/protocol   ──►  both (WebSocket message contract)
```

## game-core

A pure reducer: `reduce(state, action) → { state, outcomes } | { error }`.

- No I/O, no randomness: dice are passed in, so the same code runs on device and server and is
  trivially testable.
- `GameState` stores only facts (money, shooter, bet, point, dice…). Roles, active player,
  winning numbers and bet limits are derived through selectors, so they can never go out of sync.
- `outcomes` describe what happened (point set, round won…) and drive toasts, sounds and
  animations without diffing state.

## Backend

Hexagonal-ish layout inside `apps/backend/src`:

- `game/session.ts` — pure online-session logic (players, connections, turn deadline,
  reconnection, versioning) wrapping `game-core`.
- `game/service.ts` — use cases (create/join/rejoin/leave/actions). Depends only on interfaces in
  `game/ports.ts`, so it is tested with in-memory fakes.
- `adapters/` — DynamoDB repositories and the API Gateway notifier.
- `handlers/` — thin Lambda entry points. `infra/` — CDK app and stack.

Every mutation is read → `session` function → conditional write on `version`. A lost race is
retried once, so simultaneous actions (e.g. a move and a timeout) never overwrite each other.

## Mobile

See `docs/mobile.md`.

## Key decisions

| Decision | Why |
|---|---|
| WebSocket API Gateway + Lambda | Pay-per-use, no servers, scales to zero for a hobby game. |
| Client-triggered, server-validated timeouts | Exact 8 s turns without per-turn schedulers; the server still decides. |
| Rejoin token hashed at rest, sent only to its owner | Prevents seat hijacking by the opponent. |
| Shared packages consumed as TypeScript source | No build step; Metro and esbuild compile them directly. |
