## Seven Eleven RN

React Native + Expo application for playing the Seven Eleven dice duel, supporting both **offline** and **online** game modes.

### Requirements

- **Node.js** (LTS recommended)
- **npm** or **yarn**
- **Expo CLI** (optional but recommended): `npm install -g expo`
- **Expo Go** app on your phone (for quick testing), or:
  - Android Studio (emulator or device)
  - Xcode (iOS simulator or device, macOS only)

### Installation

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

2. (Optional) Clean/reset the starter project if needed:

   ```bash
   npm run reset-project
   ```

### Environment variables (required for online mode)

Online games communicate with a backend through a WebSocket URL. This URL is read from an Expo public environment variable.

- **Variable**: `EXPO_PUBLIC_WS_URL`
- **Where to set it**: in a `.env` file at the root of this project (next to `package.json`), or via your shell / CI environment.
- **Example value**:

  ```bash
  EXPO_PUBLIC_WS_URL=wss://xxxxxxx.execute-api.eu-west-1.amazonaws.com/prod
  ```

- **How it is used**:
  - The function `getWebSocketUrl` in `src/core/config/env.ts` reads `process.env.EXPO_PUBLIC_WS_URL`.
  - `OnlineLobbyScreen` and other online-related features depend on this value to open the WebSocket connection.

If `EXPO_PUBLIC_WS_URL` is **not** set or is empty, online features will not be able to connect to the backend (online games will fail to start or remain disconnected).

For **offline-only** testing you can skip setting this variable, but any online flow will be disabled or non-functional.

### Running the app

From the project root:

- **Start Metro / Expo dev server**:

  ```bash
  npm run start
  # or
  npx expo start
  ```

- **Run on Android**:

  ```bash
  npm run android
  ```

- **Run on iOS** (macOS only):

  ```bash
  npm run ios
  ```

- **Run on Web**:

  ```bash
  npm run web
  ```

After `npm run start`, you can:

- Open the app with **Expo Go** by scanning the QR code.
- Run it directly in emulators/simulators using the on-screen options or the scripts above.

### Project scripts

Defined in `package.json`:

- **`npm run start`**: Start the Expo development server.
- **`npm run android`**: Launch the app on an Android emulator / device.
- **`npm run ios`**: Launch the app on an iOS simulator / device.
- **`npm run web`**: Run the app in a web browser.
- **`npm run lint`**: Run ESLint over the project.
- **`npm run reset-project`**: Reset the starter code structure (used when you want a clean `app/` directory).

### Tech stack

- **Framework**: React 19 + React Native 0.81
- **Runtime / tooling**: Expo 54, Expo Router for file-based routing
- **Navigation**: React Navigation (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/elements`)
- **State management**: `zustand`
- **UI & UX**:
  - `@expo/vector-icons`
  - `react-native-gesture-handler`
  - `react-native-reanimated`
  - `@gorhom/bottom-sheet`
- **Native utilities**:
  - `expo-audio`, `expo-haptics`, `expo-clipboard`, `expo-web-browser`
  - `expo-image`, `expo-constants`, `expo-system-ui`, `expo-blur`, etc.
- **Type checking & linting**: TypeScript, ESLint (`eslint-config-expo`)

### Project structure (high level)

- **`app/`**  
  Expo Router entry points and navigation structure (e.g. `app/game/index.tsx` for the main game route).

- **`src/features/game/`**  
  Core game engine, shared components and logic:
  - `engine/` – local/online game engines and phase utilities.
  - `components/` – shared UI such as `GameEndModal`, `WinningNumberFlyer`, `PlayerInfo`, etc.
  - `screens/` – base game screens like `GameScreen`.
  - `hooks/` – shared hooks such as `useBaseGameScreen`.

- **`src/features/offline/`**  
  Offline game mode:
  - `screens/OfflineGameScreen.tsx`
  - `hooks/useOfflineGameScreen.ts` (handles offline game flow and state).

- **`src/features/online/`**  
  Online game mode:
  - `screens/OnlineGameScreen/OnlineGameScreen.tsx`
  - `screens/OnlineLobbyScreen/OnlineLobbyScreen.tsx`
  - `engine/onlineGameEngine.ts`
  - `services/WebSocketService` and related components like `JoinCodeBottomSheet`, `OnlineCodeModal`, etc.

- **`src/core/`**  
  Cross-cutting concerns:
  - `config/env.ts` – environment variable helpers (e.g. `getWebSocketUrl`).
  - `components/AppText` – shared text component.
  - `i18n/translations.ts` – translations and language support.
  - `theme/` – spacing, font size, colors, etc.

### Development workflow

1. Make sure dependencies are installed and (if you want online mode) `EXPO_PUBLIC_WS_URL` is configured.
2. Run `npm run start`.
3. Open the app on a device/emulator or in the browser.
4. Edit screens, hooks, and components under `src/` and `app/`; hot reload should apply your changes automatically.

### Linting and code quality

To run ESLint:

```bash
npm run lint
```

Fix any reported issues to keep the codebase consistent and avoid runtime problems.

### Notes

- Online mode depends entirely on the WebSocket backend being reachable via `EXPO_PUBLIC_WS_URL`.
- If you are working only on local UI / offline gameplay, you can temporarily skip backend configuration and focus on `src/features/offline` and core game components.
