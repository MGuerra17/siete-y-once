# Website

`apps/site` is a static [Astro](https://astro.build) site with the pages the stores require:

Live at **https://siete-y-once.vercel.app** (Vercel project `siete-y-once`, root directory `apps/site`).

| Page | Spanish | English |
|---|---|---|
| Landing | `/` | `/en` |
| Privacy policy (App Store + Google Play) | `/privacidad` | `/en/privacy` |
| Support (App Store "Support URL") | `/soporte` | `/en/support` |

```bash
pnpm site dev      # local server
pnpm site build    # static output in apps/site/dist
```

## Structure

- `src/config.ts` — developer name, contact email, policy date, store URLs and data retention.
- `src/i18n.ts` — routes per language and short UI strings (es, en).
- `src/components/PrivacyEs.astro` / `PrivacyEn.astro` — the policy text, one file per language.
- `src/components/SupportPage.astro` — FAQ; button names match the app's translations.
- Same palette and fonts as the app (Mesa Costeña). Fonts are self-hosted with Fontsource, so the
  site makes no third-party requests.

## Keeping the privacy policy true

The policy describes what the app and backend actually do. Update it (and `policyEffectiveDate`)
whenever any of these change:

- Data sent to the server (`packages/protocol`) or kept in DynamoDB.
- Retention: `GAME_TTL_SECONDS`, `CONNECTION_TTL_SECONDS`, log retention in the CDK stack. Mirror
  them in `retention` in `src/config.ts`.
- New SDKs that collect data (analytics, crash reporting, ads) or new hosting regions.
- The store privacy forms (App Privacy, Data safety) must match the policy.

## Store links

`site.stores.appStore` and `site.stores.googlePlay` are `null` until the app is live, which shows a
"coming soon" badge. Fill them in once the listings are public.

## Deploy (Vercel)

One-time setup: Vercel → Add New → Project → import the GitHub repository, then set
**Root Directory** to `apps/site`. Vercel detects Astro and pnpm; no `vercel.json` is needed.
Every push to `main` deploys production; pull requests get preview URLs.
