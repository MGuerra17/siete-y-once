# CI/CD

All workflows live in `.github/workflows`. Node version comes from `.nvmrc`, pnpm from
`packageManager` in the root `package.json`.

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | Every PR and push to `main` | `pnpm typecheck`, `pnpm lint`, `pnpm test` across all workspaces and a `cdk synth` of prod |
| `deploy-backend.yml` | Push to `main` touching backend/shared packages (→ dev), or manual (dev/prod) | Tests, `cdk diff`, `cdk deploy` with OIDC credentials |
| `mobile-build.yml` | Manual | `eas build` for a profile/platform, optionally `--auto-submit` to the stores |
| `dependabot.yml` | Weekly | Grouped dependency PRs; Expo-managed packages are excluded (upgrade them per SDK) |

## One-time setup

1. **AWS deploy role (OIDC, no stored keys)**

   ```bash
   pnpm backend run deploy Seven-github -c githubRepo=<owner>/<repo> \
     -c githubSubjectPrefix=$(gh api repos/<owner>/<repo>/actions/oidc/customization/sub --jq .sub_claim_prefix)
   ```

   Copy the `DeployRoleArn` output into the repository variable `AWS_DEPLOY_ROLE_ARN`
   (Settings → Secrets and variables → Actions → Variables).
   New repositories use GitHub's immutable OIDC subjects (`repo:owner@id/repo@id`), which is why
   the role also trusts `githubSubjectPrefix`; without it, deploys fail with "Not authorized to
   perform sts:AssumeRoleWithWebIdentity". The role can only assume the CDK
   bootstrap roles and only from `main` or a GitHub environment of this repository.

   Optionally set the repository variable `ALARM_EMAIL`: prod deploys subscribe it to the Lambda
   error alarms (AWS sends a confirmation e-mail first). Dev deploys never send e-mail.

2. **Environments**: create `dev` and `prod` in Settings → Environments and add yourself as a
   required reviewer on `prod`.

3. **Expo**: create an access token at expo.dev → Account settings → Access tokens and save it as
   the `EXPO_TOKEN` repository secret. Store credentials (App Store Connect API key, Google Play
   service account) are configured once with `eas credentials` / `eas submit`.
