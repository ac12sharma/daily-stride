# Daily Stride MVP Audit

## Repository Structure
- `src/`: React frontend (pages, hooks, reusable components).
- `supabase/`: Database migration and Supabase project config.
- `public/`: static assets.
- Root build/tooling files: Vite, Tailwind, TypeScript, ESLint, Vitest.

## Current Architecture
- **Frontend**: Vite + React + TypeScript + Tailwind/shadcn UI.
- **Auth**: OAuth via Lovable cloud auth and Supabase session management.
- **Data/API layer**: Supabase JS client called directly from React hooks.
- **Database**: PostgreSQL on Supabase with RLS policies.

## How the App Works Today
1. User authenticates with Google/Apple.
2. Protected routes render home/leaderboard/badges/stats.
3. Home page displays step progress and allows **simulated step increments** (+500/+1000/+2500).
4. Step and goal updates are upserted into `daily_steps`.
5. Streak and best streak are computed in client hooks from historical data.
6. Leaderboard reads today's `daily_steps` and joins profile metadata.
7. Badges page reads pre-unlocked `user_badges`; no automated badge-award pipeline in app.
8. Stats page computes totals and weekly chart on the client.

## MVP Gaps vs Production Fitness App
- No true step ingestion from device sensors/wearables.
- No challenge domain model or challenge workflows.
- No friends-only leaderboard filtering or social graph UX despite `friendships` table.
- No push notifications, reminders, or anti-cheat controls.
- No backend service/business logic tier; all logic is client-side.
- No observability, analytics, SLOs, or incident tooling.

## Key Risks
- Client-side step simulation makes score manipulation trivial.
- Streak/badge logic duplicated across hooks and can drift.
- RLS policy allows broad read access for today's leaderboard records.
- Minimal tests (single smoke test) and no integration/e2e suite.
- Repository README remains Lovable boilerplate.

## Recommended Next Steps (90-day)
### Phase 1 (1-2 weeks)
- Replace simulator with trusted step ingestion architecture (mobile bridge/API).
- Centralize streak/badge calculations in SQL functions or server functions.
- Add robust error handling/loading states for all Supabase calls.
- Replace README with real setup + architecture docs.

### Phase 2 (2-6 weeks)
- Add challenge tables, challenge participation, and reward issuance.
- Implement friends leaderboard (accepted friendships) and privacy settings.
- Build notification service (goal reminders, streak at risk, challenge updates).
- Add meaningful automated tests (unit + integration + basic e2e).

### Phase 3 (6-12 weeks)
- Add anti-cheat heuristics and anomaly detection pipelines.
- Add event analytics + observability dashboards.
- Add AI coach service layer (prompt safety, user context, recommendation guardrails).
- Introduce background jobs/queue for badge/challenge processing at scale.
