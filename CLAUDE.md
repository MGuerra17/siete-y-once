# Siete y Once

Two-player dice duel from Colombia's Caribbean coast (a craps variant locally called "Seven Eleven").
Store name: "Siete y Once: Duelo de Dados". Never use "Seven Eleven"/"7-11" in branding (7-Eleven trademark).
pnpm monorepo: Expo app + AWS serverless backend + public website + shared TypeScript packages.

## Layout

- `apps/mobile` — Expo (SDK 57) app, expo-router, zustand. Offline (same device) and online modes.
- `apps/backend` — API Gateway WebSocket + Lambda + DynamoDB, defined with CDK.
- `apps/site` — Astro static site (landing, privacy policy, support) deployed on Vercel; URLs used by the store listings.
- `packages/game-core` — pure rules engine (`reduce`, selectors, constants). **Single source of truth for rules.**
- `packages/protocol` — WebSocket message types shared by app and backend.

## Commands (from repo root)

- `pnpm test` / `pnpm typecheck` / `pnpm lint` — all workspaces
- `pnpm mobile start` — Expo dev server
- `pnpm site dev` — website dev server
- `pnpm backend synth -c stage=dev` / `pnpm backend deploy -c stage=dev`

## Rules of thumb

- Game rules change only in `game-core`, with tests. Never duplicate rule logic in app or backend.
- Protocol changes go in `packages/protocol` and must be handled on both sides.
- The server is authoritative online: it rolls the dice and applies turn timeouts.
- Never send secrets (rejoin tokens, connection ids) in broadcast state.
- UI/visual changes: show an HTML mockup for approval before implementing.
- Code, comments and docs in English; user-facing text through i18n (es, en).

## Docs (read the relevant one before working in an area)

- `docs/game-rules.md` — exact rules, phases, timers, disconnection policy
- `docs/architecture.md` — how the pieces fit, state flow, design decisions
- `docs/protocol.md` — WebSocket actions, events and errors
- `docs/backend.md` — infrastructure, deploy, operations, costs
- `docs/ci-cd.md` — GitHub Actions, OIDC deploys, EAS builds
- `docs/mobile.md` — app structure and conventions
- `docs/site.md` — public website, privacy policy upkeep, Vercel setup
- `docs/roadmap.md` — improvement plan and status
