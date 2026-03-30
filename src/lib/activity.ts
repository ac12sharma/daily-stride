import type { Reward } from "@/hooks/useStepTracker";

export const DEFAULT_GOAL = 8000;
export const MIN_GOAL = 1000;
export const MAX_GOAL = 100000;
export const MAX_STEP_INCREMENT = 20000;

export const REWARD_DEFINITIONS: Omit<Reward, "unlocked">[] = [
  { id: "first-step", title: "First Step", description: "Complete your first day", requiredStreak: 1, icon: "🔥" },
  { id: "hat-trick", title: "Hat Trick", description: "3-day streak", requiredStreak: 3, icon: "⚡" },
  { id: "weekly-warrior", title: "Weekly Warrior", description: "7-day streak", requiredStreak: 7, icon: "🏆" },
  { id: "iron-will", title: "Iron Will", description: "14-day streak", requiredStreak: 14, icon: "💎" },
  { id: "unstoppable", title: "Unstoppable", description: "30-day streak", requiredStreak: 30, icon: "👑" },
];

export function getLocalDateString(date: Date = new Date()): string {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
}

function toUtcDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

export function calculateStreaks(completedDates: string[], baseDate: Date = new Date()) {
  const uniqueSorted = [...new Set(completedDates)].sort();
  const dateSet = new Set(uniqueSorted);

  let currentStreak = 0;
  const cursor = new Date(baseDate);
  let cursorDate = getLocalDateString(cursor);
  if (!dateSet.has(cursorDate)) {
    cursor.setDate(cursor.getDate() - 1);
    cursorDate = getLocalDateString(cursor);
  }

  while (dateSet.has(cursorDate)) {
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
    cursorDate = getLocalDateString(cursor);
  }

  let bestStreak = 0;
  let running = 0;
  for (let i = 0; i < uniqueSorted.length; i += 1) {
    if (i === 0) {
      running = 1;
    } else {
      const prev = toUtcDate(uniqueSorted[i - 1]);
      const curr = toUtcDate(uniqueSorted[i]);
      const diffDays = (curr.getTime() - prev.getTime()) / 86_400_000;
      running = diffDays === 1 ? running + 1 : 1;
    }
    bestStreak = Math.max(bestStreak, running);
  }

  return { currentStreak, bestStreak };
}

export function sanitizeGoal(goal: number): number {
  if (!Number.isFinite(goal)) return DEFAULT_GOAL;
  return Math.max(MIN_GOAL, Math.min(MAX_GOAL, Math.round(goal)));
}

export function sanitizeStepIncrement(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.min(MAX_STEP_INCREMENT, Math.round(amount));
}

export function buildRewards(streak: number, bestStreak: number): Reward[] {
  return REWARD_DEFINITIONS.map((reward) => ({
    ...reward,
    unlocked: streak >= reward.requiredStreak || bestStreak >= reward.requiredStreak,
  }));
}
