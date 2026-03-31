# Daily Stride Mobile (Expo)

This is a fresh Expo app scaffold for the mobile version of Daily Stride.

## Why this exists
The existing repository is a web-first Vite app. This `apps/mobile` project provides an Expo Go-compatible mobile client with a clean, modular screen architecture.

## Implemented screens
- Home
- Leaderboard
- Rewards
- Profile

## Run locally
```bash
cd apps/mobile
npm install
npm run start
```

Then scan the QR code in Expo Go.

## Notes
- Built with Expo SDK 54-compatible dependency set.
- Uses simple mocked data now; replace with Supabase-backed services in next iteration.
