import { useState, useCallback, useEffect } from "react";

export interface Reward {
  id: string;
  title: string;
  description: string;
  requiredStreak: number;
  icon: string;
  unlocked: boolean;
}

const REWARDS: Omit<Reward, "unlocked">[] = [
  { id: "first-step", title: "First Step", description: "Complete your first day", requiredStreak: 1, icon: "🔥" },
  { id: "hat-trick", title: "Hat Trick", description: "3-day streak", requiredStreak: 3, icon: "⚡" },
  { id: "weekly-warrior", title: "Weekly Warrior", description: "7-day streak", requiredStreak: 7, icon: "🏆" },
  { id: "iron-will", title: "Iron Will", description: "14-day streak", requiredStreak: 14, icon: "💎" },
  { id: "unstoppable", title: "Unstoppable", description: "30-day streak", requiredStreak: 30, icon: "👑" },
];

interface StepData {
  steps: number;
  goal: number;
  streak: number;
  bestStreak: number;
  lastCompletedDate: string | null;
}

const STORAGE_KEY = "stride-data";

function loadData(): StepData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { steps: 0, goal: 8000, streak: 0, bestStreak: 0, lastCompletedDate: null };
}

function saveData(data: StepData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function useStepTracker() {
  const [data, setData] = useState<StepData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Check if streak should reset (missed a day)
  useEffect(() => {
    if (data.lastCompletedDate) {
      const last = new Date(data.lastCompletedDate);
      const today = new Date(getToday());
      const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 1) {
        setData(prev => ({ ...prev, streak: 0 }));
      }
    }
  }, []);

  const progress = Math.min(data.steps / data.goal, 1);
  const goalReached = data.steps >= data.goal;

  const addSteps = useCallback((amount: number) => {
    setData(prev => {
      const newSteps = prev.steps + amount;
      const justReached = newSteps >= prev.goal && prev.steps < prev.goal;
      const today = getToday();

      if (justReached && prev.lastCompletedDate !== today) {
        const newStreak = prev.streak + 1;
        return {
          ...prev,
          steps: newSteps,
          streak: newStreak,
          bestStreak: Math.max(newStreak, prev.bestStreak),
          lastCompletedDate: today,
        };
      }
      return { ...prev, steps: newSteps };
    });
  }, []);

  const setGoal = useCallback((goal: number) => {
    setData(prev => ({ ...prev, goal }));
  }, []);

  const resetDay = useCallback(() => {
    setData(prev => ({ ...prev, steps: 0 }));
  }, []);

  const rewards: Reward[] = REWARDS.map(r => ({
    ...r,
    unlocked: data.streak >= r.requiredStreak || data.bestStreak >= r.requiredStreak,
  }));

  return {
    steps: data.steps,
    goal: data.goal,
    streak: data.streak,
    bestStreak: data.bestStreak,
    progress,
    goalReached,
    rewards,
    addSteps,
    setGoal,
    resetDay,
  };
}
