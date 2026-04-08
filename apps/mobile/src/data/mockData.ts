import type { LeaderboardItem, Reward } from '../types';

export const homeStats = {
  steps: 6840,
  goal: 10000,
  streak: 12,
  bestStreak: 19,
  distanceMiles: 3.4,
  activeMinutes: 62,
};

export const activityHistory = [
  { date: '2026-04-07', dateLabel: 'Tue, Apr 7', shortDay: 'Tue', steps: 6840 },
  { date: '2026-04-06', dateLabel: 'Mon, Apr 6', shortDay: 'Mon', steps: 8120 },
  { date: '2026-04-05', dateLabel: 'Sun, Apr 5', shortDay: 'Sun', steps: 9435 },
  { date: '2026-04-04', dateLabel: 'Sat, Apr 4', shortDay: 'Sat', steps: 10220 },
  { date: '2026-04-03', dateLabel: 'Fri, Apr 3', shortDay: 'Fri', steps: 11830 },
  { date: '2026-04-02', dateLabel: 'Thu, Apr 2', shortDay: 'Thu', steps: 7730 },
  { date: '2026-04-01', dateLabel: 'Wed, Apr 1', shortDay: 'Wed', steps: 6910 },
];

export const leaderboard: LeaderboardItem[] = [
  { id: 'u2', name: 'Maya', steps: 13240, avatar: 'M' },
  { id: 'u3', name: 'Chris', steps: 12190, avatar: 'C' },
  { id: 'u1', name: 'You', steps: 6840, avatar: 'Y', isCurrentUser: true },
  { id: 'u4', name: 'Avery', steps: 6510, avatar: 'A' },
];

export const rewards: Reward[] = [
  { id: 'r1', title: 'First Step', description: 'Hit daily goal once', progress: 1, unlocked: true },
  { id: 'r2', title: 'Weekly Warrior', description: '7-day streak', progress: 1, unlocked: true },
  { id: 'r3', title: 'Unstoppable', description: '30-day streak', progress: 0.4, unlocked: false },
  { id: 'r4', title: '10K Crusher', description: '10k in a day', progress: 0.68, unlocked: false },
];
