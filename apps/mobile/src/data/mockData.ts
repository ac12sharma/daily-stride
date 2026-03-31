import type { LeaderboardItem, Reward } from '../types';

export const homeStats = {
  steps: 6840,
  goal: 10000,
  streak: 12,
  weeklyDelta: 18,
};

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
