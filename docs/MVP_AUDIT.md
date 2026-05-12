# Daily Stride Repository Stability Audit (May 12, 2026)

## Scope and Validation Performed
- Repository structure inspection
- Dependency and lockfile validation
- Build verification (`npm run build`)
- CI/workflow relevance check
- Stack consistency review against iOS-focused fitness MVP goals

## Critical Issues
1. **Dependency install is not reproducible with `npm ci`.**
   - `npm ci` fails because `package-lock.json` is out of sync with `package.json`.
   - This blocks reliable local setup and CI reproducibility.

2. **Invalid React versions in manifest.**
   - `react` and `react-dom` were pinned to `^18.3.1`, which is not resolvable in this environment and caused invalid installs.
   - Result: widespread TypeScript/module-resolution failures during build.

3. **CI pipeline was misconfigured for wrong runtime.**
   - The repo contained a Deno workflow that runs `deno lint` and `deno test` despite this being a Vite + React + TypeScript app.
   - This guarantees irrelevant CI failures and hides actual web build breakages.

## Warnings
1. **Mixed technology footprint (web + iOS skeleton in same repo).**
   - `AppSkeleton/*.swift` exists beside the React app.
   - This is not inherently broken, but should be explicitly structured (monorepo with clear app boundaries) to avoid confusion.

2. **Dual lockfile ecosystem indicator.**
   - `bun.lock` existed despite npm-based scripts/workflows.
   - Mixed package manager artifacts create drift and onboarding friction.

3. **Network/policy constraints can block install validation.**
   - During this audit run, `npm install` hit a registry access error (`403` for `picomatch`), so full reinstall could not be completed in this environment.

## Cleanup Applied in This Branch
- Replaced invalid React pins with stable React 18.2-compatible versions in `package.json`.
- Removed irrelevant Deno workflow.
- Added Node-based CI workflow for install + build checks.
- Removed `bun.lock` to keep package management consistent with npm.

## Recommended Architecture Direction
For a clean iOS-focused MVP inspired by Strava/Apple Fitness:
1. **Adopt explicit monorepo layout**
   - `apps/web` (current Vite app) and `apps/ios` (Swift app) or remove one if not actively used.
2. **Single package manager policy**
   - Keep npm-only (or pnpm-only), one lockfile, and enforce via CI.
3. **Shared domain contracts**
   - Keep step/streak/leaderboard models in shared schema/docs and avoid duplicating logic across clients.
4. **CI per app boundary**
   - Separate workflow jobs for web and iOS targets.

## Current Local Runnability Status
- **Not fully verifiable in this environment** due to external registry access restriction encountered during reinstall.
- **Structurally improved for local runnability** after dependency/version and CI cleanup.
- Next required validation on an unrestricted machine:
  1. `npm install`
  2. `npm run build`
  3. `npm run dev`
