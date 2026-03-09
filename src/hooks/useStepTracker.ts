import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

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

export function useStepTracker() {
  const { user } = useAuth();
  const [steps, setSteps] = useState(0);
  const [goal, setGoalState] = useState(8000);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load today's data from DB
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const today = new Date().toISOString().slice(0, 10);

      // Get today's steps
      const { data: todayData } = await supabase
        .from("daily_steps")
        .select("steps, goal")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (todayData) {
        setSteps(todayData.steps);
        setGoalState(todayData.goal);
      }

      // Calculate streak from history
      const { data: history } = await supabase
        .from("daily_steps")
        .select("date, steps, goal")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(365);

      if (history) {
        let currentStreak = 0;
        let best = 0;
        const dates = history.filter(d => d.steps >= d.goal).map(d => d.date);
        const dateSet = new Set(dates);

        // Count streak backwards from today/yesterday
        const checkDate = new Date();
        // If today isn't completed, start from yesterday
        const todayStr = checkDate.toISOString().slice(0, 10);
        if (!dateSet.has(todayStr)) {
          checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
          const d = checkDate.toISOString().slice(0, 10);
          if (dateSet.has(d)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        // Calculate best streak
        const sortedDates = [...dates].sort();
        let tempStreak = 0;
        for (let i = 0; i < sortedDates.length; i++) {
          if (i === 0) {
            tempStreak = 1;
          } else {
            const prev = new Date(sortedDates[i - 1]);
            const curr = new Date(sortedDates[i]);
            const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
            tempStreak = diff === 1 ? tempStreak + 1 : 1;
          }
          best = Math.max(best, tempStreak);
        }

        setStreak(currentStreak);
        setBestStreak(best);
      }

      setLoading(false);
    };

    loadData();
  }, [user]);

  const progress = Math.min(steps / goal, 1);
  const goalReached = steps >= goal;

  const addSteps = useCallback(async (amount: number) => {
    if (!user) return;
    const newSteps = steps + amount;
    setSteps(newSteps);

    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from("daily_steps")
      .upsert(
        { user_id: user.id, date: today, steps: newSteps, goal },
        { onConflict: "user_id,date" }
      );

    // Check if just reached goal — update streak
    if (newSteps >= goal && steps < goal) {
      setStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, streak + 1));
    }
  }, [user, steps, goal, streak]);

  const setGoal = useCallback(async (newGoal: number) => {
    if (!user) return;
    setGoalState(newGoal);
    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from("daily_steps")
      .upsert(
        { user_id: user.id, date: today, steps, goal: newGoal },
        { onConflict: "user_id,date" }
      );
  }, [user, steps]);

  const rewards: Reward[] = REWARDS.map(r => ({
    ...r,
    unlocked: streak >= r.requiredStreak || bestStreak >= r.requiredStreak,
  }));

  return {
    steps, goal, streak, bestStreak,
    progress, goalReached, rewards,
    addSteps, setGoal, loading,
  };
}
