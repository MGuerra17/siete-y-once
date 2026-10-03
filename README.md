# Siete y Once: Duelo de Dados

A real-time, two-player dice duel from Colombia's Caribbean coast, where it is known as
"Seven Eleven". Play on one device or online against a friend with a 6-letter code.

| | |
|---|---|
| **App** | Expo SDK 57 · React Native 0.86 · TypeScript · expo-router · zustand · Reanimated |
| **Backend** | AWS API Gateway WebSocket · Lambda (Node 22, arm64) · DynamoDB · CDK |
| **Shared** | Pure rules engine (`packages/game-core`) used by both the app and the server |

## Getting started

```bash
nvm use            # Node 22
corepack enable    # pnpm
pnpm install
pnpm test
pnpm mobile start
```

## Documentation

- [Game rules](docs/game-rules.md)
- [Architecture](docs/architecture.md)
- [WebSocket protocol](docs/protocol.md)
- [Backend & deployment](docs/backend.md)
- [CI/CD](docs/ci-cd.md)
- [Mobile app](docs/mobile.md)
- [Roadmap](docs/roadmap.md)
