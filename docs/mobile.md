# Mobile app

Expo SDK 57 · React Native 0.86 · React 19.2 (React Compiler) · expo-router · zustand ·
Reanimated 4 · expo-audio. Rules come from `@seven/game-core`, the online contract from
`@seven/protocol`.

## Requirements

- Node 22.13+, pnpm 10
- Xcode 26.4+ for local iOS builds (EAS Build uses the right version in the cloud)
- Android Studio / JDK 17 for local Android builds

## Environment

`apps/mobile/.env.local` (see `.env.example`):

```
EXPO_PUBLIC_WS_URL=wss://<api-id>.execute-api.us-east-1.amazonaws.com/<stage>
```

That file is only for the local dev server. EAS builds take the URL from `env` in `eas.json`:

| Profile | Backend |
|---|---|
| `development` | dev |
| `preview` | prod (internal test builds of what ships) |
| `production` | prod |

## Commands

```bash
pnpm mobile start        # dev server
pnpm mobile test         # jest-expo + Testing Library
pnpm mobile lint         # expo lint (includes React Compiler rules)
pnpm mobile typecheck
```

## Structure

```
app/                         expo-router routes (thin: render a feature screen)
src/
  core/                      app-wide building blocks
    components/              AmbientBackground, AppText, Avatar, PrimaryButton, ScreenContainer…
    hooks/                   useLanguage (t with {placeholders}), useSound, useBreakpoints
    i18n/                    translations (es/en), formatMessage, translateNow (outside React)
    settings/                persisted settings store (language, sound)
    utils/                   sleep/runCancellable, emitter, formatMoney
  features/
    game/                    presentation shared by both modes
      model/                 boardView (rules state → seats), messages (outcomes → toasts), countdown
      components/            board, dice, bet sheet, toast, status banner, end modal…
      hooks/                 useTurnTimer, useCountdownProgress, useGameSounds, useDiceAnimation…
      store/                 turnTimerStore (countdown read only by the components that draw it)
      screens/GameScreen     presentational screen fed by either mode
    offline/                 same-device mode
      engine/                offlineController: game-core reduce + cancellable pacing
      store/, hooks/, screens/
    online/                  online mode
      services/socketClient  one WebSocket, backoff reconnect, keep-alive ping
      engine/onlineClient    session, ordered snapshot presentation, actions, timeouts
      model/presentation     pure decisions (version ordering, toasts, auto-keep, error keys)
      storage/, store/, hooks/, components/, screens/
```

## Design system ("Mesa Costeña", poster layout)

- **Tokens** in `src/theme`: `colors` (mar profundo `#0D3B3E` background, paño `#135E5A`,
  arena `#F3E3C3`, coral `#F2694B` primary, sol `#F6B93B`), `typography` (Bricolage Grotesque
  for titles/figures, Figtree for UI; weights are separate families for Android), `spacing`
  (incl. `MIN_TOUCH` 44), `shadows`.
- **PosterScreen**: every screen's layout. Edge-to-edge illustration from the top (9:16),
  top scrim, bottom fade into the background, eyebrow + title in the sky, content anchored to
  the bottom with safe areas; content is capped and centered on tablets.
- **Glass**: `GlassSurface` / `GlassButton` / `IconButton` (expo-blur + translucent sea tint).
  **SandSheet** for bottom sheets (bet, rules, settings).
- **Illustrations** (`src/core/assets/illustrations`): WebP 1170 px wide (~150–210 KB),
  generated with OpenArt (GPT Image) from one approved scene so they stay one family. Brand
  vector sources (icon, Android layers, splash) live in `assets/brand/*.svg`.
- **Dice** are drawn in code (`Dice` + `dieLayout`), top-down to match the table illustration,
  animated with Reanimated (respecting reduced motion).
- **Haptics** via `src/core/utils/haptics.ts`, gated by the persisted `hapticsEnabled` setting.

## How a game flows

- **Offline**: `offlineController` applies actions with `reduce` from game-core, then paces the
  result (roll animation → result toast → prompt). Every pending step listens to an
  `AbortSignal`, so leaving the screen cancels it.
- **Online**: the server is authoritative. `onlineClient` sends actions, receives `gameState`
  snapshots, drops stale versions and presents them one at a time (animation, sounds, toasts).
  It stores the private session to rejoin after a dropped connection or an app restart, asks the
  server to apply turn timeouts, and claims the win when the opponent's reconnect window ends.
- Both modes render the same `GameScreen` from a `BoardView`, where `player1` is always the
  bottom seat (the local player online).

## Conventions

- One component per folder: `Name.tsx`, `Name.styles.ts`, `Name.types.ts`, optional
  `Name.test.tsx`. Import with the `@/src/...` alias, no barrel files.
- No game rules in the app: use game-core selectors (`getMaxBet`, `getActivePlayerId`…).
- Controllers and models are plain TypeScript with injected dependencies, so they are unit-tested
  without rendering; components get a few render tests for behavior and accessibility.
- No `setState` during render or synchronously inside effects (React Compiler lint rules).
- `ios/` and `android/` are generated (Continuous Native Generation): never edit them, change
  `app.json` or a config plugin and run `npx expo prebuild --clean`.
