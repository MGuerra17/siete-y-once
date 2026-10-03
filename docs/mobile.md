# Mobile app

Expo SDK 57 · React Native 0.86 · expo-router · zustand · Reanimated 4 · expo-audio.

> The app is being refactored onto `@seven/game-core` and protocol v2 (see `roadmap.md`).
> This document will describe the final structure once that lands.

## Requirements

- Node 22.13+, pnpm 10
- Xcode 26.4+ for local iOS builds (EAS Build uses the right version in the cloud)
- Android Studio / JDK 17 for local Android builds

## Environment

`apps/mobile/.env.local`:

```
EXPO_PUBLIC_WS_URL=wss://<api-id>.execute-api.us-east-1.amazonaws.com/<stage>
```

## Conventions

- Feature folders under `src/features/<feature>/{components,hooks,screens,store,utils}`.
- One component per folder: `Name.tsx`, `Name.styles.ts`, `Name.types.ts`, optional `Name.test.tsx`.
- `ios/` and `android/` are generated (Continuous Native Generation): never edit them, change
  `app.json` or a config plugin and run `npx expo prebuild --clean`.
