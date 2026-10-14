/** Facts shown on the site. Keep them in sync with the app, the backend and the store listings. */
export const site = {
  appName: "Siete y Once",
  storeName: "Siete y Once: Duelo de Dados",
  developer: "Miguel Angel Guerra Chamorro",
  contactEmail: "m.guerra1705@gmail.com",
  /** Date the current privacy policy took effect (ISO). Update it whenever the policy changes. */
  policyEffectiveDate: "2026-10-14",
  /** Store listing URLs; null until the app is live, which renders a "coming soon" badge. */
  stores: {
    appStore: null as string | null,
    googlePlay: null as string | null,
  },
} as const;

/** Data retention, mirrored from apps/backend (GAME_TTL_SECONDS, CONNECTION_TTL_SECONDS, log retention). */
export const retention = {
  gameHours: 24,
  connectionHours: 3,
  logDays: 30,
} as const;
