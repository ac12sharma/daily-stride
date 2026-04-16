import type { LeaderboardItem, Reward } from '../types';

export const homeStats = {
  goal: 10000,
  streak: 12,
  bestStreak: 19,
  distanceMiles: 3.4,
  activeMinutes: 62,
};

export const leaderboard: LeaderboardItem[] = [
  { id: 'u2', name: 'Maya', avatar: 'M' },
  { id: 'u5', name: 'Jordan', avatar: 'J' },
  { id: 'u3', name: 'Chris', avatar: 'C' },
  { id: 'u6', name: 'Riley', avatar: 'R' },
  { id: 'u1', name: 'You', avatar: 'Y', isCurrentUser: true },
  { id: 'u4', name: 'Avery', avatar: 'A' },
];

export const rewards: Reward[] = [
  { id: 'r1', title: 'First Step', description: 'Hit daily goal once', progress: 1, unlocked: true },
  { id: 'r2', title: 'Weekly Warrior', description: '7-day streak', progress: 1, unlocked: true },
  { id: 'r3', title: 'Unstoppable', description: '30-day streak', progress: 0.4, unlocked: false },
  { id: 'r4', title: '10K Crusher', description: '10k in a day', progress: 0.68, unlocked: false },
];
