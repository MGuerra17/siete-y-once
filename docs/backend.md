# Backend

## Stack (`apps/backend/src/infra/stack.ts`)

- API Gateway WebSocket API, stage throttled to 50 req/s (burst 100).
- 3 Lambdas (`connect`, `disconnect`, `message`): Node 22, arm64, 1 GB, JSON logs kept 30 days.
- DynamoDB `Games` (GSI `shortCode-index`) and `Connections`, on-demand, TTL on `expiresAt`.
  Production tables are retained and deletion-protected.
- Error alarms → SNS topic (optional e-mail with `-c alarmEmail=you@example.com`).

## Deploy

```bash
pnpm backend diff   -c stage=dev
pnpm backend run deploy -c stage=dev     # stack Seven-dev
pnpm backend run deploy -c stage=prod    # stack Seven-prod
```

Copy the `WebSocketUrl` output into `apps/mobile/.env.local` as `EXPO_PUBLIC_WS_URL` for local
development, and into `env` of the matching profile in `apps/mobile/eas.json` for builds.

## Operations

- Logs: CloudWatch Logs Insights, filter on `level` / `connectionId`.
- Cost at hobby scale is effectively zero: pay-per-request everywhere, no idle resources.
- The legacy stack `SevenElevenStack` (pre-monorepo) can be deleted once the app points to the
  new stack.
