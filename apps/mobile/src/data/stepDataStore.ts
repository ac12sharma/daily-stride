import type { LeaderboardItem, StepData } from '../types';

const CURRENT_USER_ID = 'u1';
const TODAY = new Date('2026-04-16T00:00:00.000Z');

const currentUserStepHistory: StepData[] = [
  { id: 'sd-u1-2026-04-16', date: new Date('2026-04-16T00:00:00.000Z'), steps: 6840 },
  { id: 'sd-u1-2026-04-15', date: new Date('2026-04-15T00:00:00.000Z'), steps: 8120 },
  { id: 'sd-u1-2026-04-14', date: new Date('2026-04-14T00:00:00.000Z'), steps: 9435 },
  { id: 'sd-u1-2026-04-13', date: new Date('2026-04-13T00:00:00.000Z'), steps: 10220 },
  { id: 'sd-u1-2026-04-12', date: new Date('2026-04-12T00:00:00.000Z'), steps: 11830 },
  { id: 'sd-u1-2026-04-11', date: new Date('2026-04-11T00:00:00.000Z'), steps: 7730 },
  { id: 'sd-u1-2026-04-10', date: new Date('2026-04-10T00:00:00.000Z'), steps: 6910 },
];

const leaderboardStepHistoryByUser: Record<string, StepData[]> = {
  u1: currentUserStepHistory,
  u2: [{ id: 'sd-u2-2026-04-16', date: TODAY, steps: 18440 }],
  u5: [{ id: 'sd-u5-2026-04-16', date: TODAY, steps: 17120 }],
  u3: [{ id: 'sd-u3-2026-04-16', date: TODAY, steps: 16390 }],
  u6: [{ id: 'sd-u6-2026-04-16', date: TODAY, steps: 14110 }],
  u4: [{ id: 'sd-u4-2026-04-16', date: TODAY, steps: 11750 }],
};

export function getCurrentUserId() {
  return CURRENT_USER_ID;
}

export function getCurrentUserStepHistory() {
  return [...currentUserStepHistory];
}

export function getCurrentUserTodayStepData() {
  return currentUserStepHistory[0];
}

export function getStepHistoryForUser(userId: string) {
  return [...(leaderboardStepHistoryByUser[userId] ?? [])];
}

export function getLeaderboardRows(users: LeaderboardItem[]) {
  return users
    .map((user) => {
      const latest = getStepHistoryForUser(user.id)
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

      return {
        ...user,
        steps: latest?.steps ?? 0,
      };
    })
    .sort((a, b) => b.steps - a.steps);
}
