# Lab 11.2 — CI/CD Pipeline Setup (The Last Deadline)

## What the pipeline does
On every push/PR to `main`:
1. **Lint** — `npm run lint` (ESLint)
2. **Test** — `npm run test` (Vitest)
3. **Build** — `npm run build` (Vite)
4. **E2E** — `npm run e2e` (Playwright against the built app)
5. **Zip artifacts** — zips `dist/` and uploads it to the workflow run
6. **Release** — deploys to Vercel production (only on push to `main`, only if everything passed)

---

## Step 1 — Copy files into your repo (VS Code)
Put these files in your `the-last-deadline` repo:
- `.github/workflows/ci-cd.yml`
- `playwright.config.ts` (repo root)
- `e2e/smoke.spec.ts`
- `src/__tests__/smoke.test.ts`

## Step 2 — Install dev dependencies (VS Code terminal, PowerShell)
```powershell
npm install -D vitest @playwright/test
npx playwright install chromium
```

## Step 3 — Add scripts to package.json
In the `"scripts"` section, make sure you have (keep your existing ones):
```json
"lint": "eslint .",
"test": "vitest run",
"e2e": "playwright test",
"preview": "vite preview"
```
(Your Vite template probably already has `lint` and `preview`.)

## Step 4 — Test locally first
```powershell
npm run lint
npm run test
npm run build
npm run e2e
```
Fix any lint errors before pushing (or run `npm run lint -- --fix`).

## Step 5 — Add GitHub secrets (browser)
Go to your repo on GitHub → **Settings → Secrets and variables → Actions → New repository secret**. Add:

| Secret name | Where to get it |
|---|---|
| `VITE_SUPABASE_URL` | Your `.env` file |
| `VITE_SUPABASE_ANON_KEY` | Your `.env` file |
| `VITE_VAPID_PUBLIC_KEY` | Your `.env` file |
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens → Create |
| `VERCEL_ORG_ID` | `.vercel/project.json` in your repo folder (run `vercel link` once if missing) |
| `VERCEL_PROJECT_ID` | Same file as above |

Then in `ci-cd.yml`, the Vercel steps also need the org/project IDs. Add this under the `deploy` job (already handled if you ran `vercel link` — but safest is to add env):
```yaml
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```
(Add these two lines under `deploy:` at the same level as `steps:`.)

## Step 6 — Turn off Vercel auto-deploy (optional but recommended)
Since GitHub Actions is now doing the deploy, disable Vercel's own git auto-deploy so you don't deploy twice:
- vercel.com → your project → Settings → Git → set the "Ignored Build Step" command to `exit 0`, or disconnect the git integration.

## Step 7 — Commit & push (GitHub Desktop)
1. Open GitHub Desktop, review the changed files
2. Commit message: `Add CI/CD pipeline (Lab 11.2)`
3. Push to `main`
4. Go to the repo on GitHub → **Actions** tab → watch it run 🎉

## What to submit
Your pipeline link:
```
https://github.com/Johny21D/<your-repo-name>/actions/workflows/ci-cd.yml
```
Or link directly to a green (passed) run from the Actions tab.
