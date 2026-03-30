import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import {
  DEFAULT_GOAL,
  buildRewards,
  calculateStreaks,
  getLocalDateString,
  sanitizeGoal,
  sanitizeStepIncrement,
} from "@/lib/activity";
import { logger } from "@/lib/logger";

export interface Reward {
  id: string;
  title: string;
  description: string;
  requiredStreak: number;
  icon: string;
  unlocked: boolean;
}

export function useStepTracker() {
  const { user } = useAuth();
  const [steps, setSteps] = useState(0);
  const [goal, setGoalState] = useState(DEFAULT_GOAL);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const today = getLocalDateString();
      const { data: todayData, error: todayError } = await supabase
        .from("daily_steps")
        .select("steps, goal")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (todayError) throw todayError;

      setSteps(todayData?.steps ?? 0);
      setGoalState(sanitizeGoal(todayData?.goal ?? DEFAULT_GOAL));

      const { data: history, error: historyError } = await supabase
        .from("daily_steps")
        .select("date, steps, goal")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(365);

      if (historyError) throw historyError;

      const completedDates = (history ?? [])
        .filter((entry) => entry.steps >= entry.goal)
        .map((entry) => entry.date);

      const { currentStreak, bestStreak: longest } = calculateStreaks(completedDates);
      setStreak(currentStreak);
      setBestStreak(longest);
    } catch (error) {
      logger.error("Failed to load step data", {
        userId: user.id,
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const progress = Math.min(steps / goal, 1);
  const goalReached = steps >= goal;

  const addSteps = useCallback(
    async (amount: number) => {
      if (!user) return;

      const increment = sanitizeStepIncrement(amount);
      if (increment <= 0) return;

      const newSteps = steps + increment;
      setSteps(newSteps);

      const today = getLocalDateString();
      const { error } = await supabase.from("daily_steps").upsert(
        { user_id: user.id, date: today, steps: newSteps, goal },
        { onConflict: "user_id,date" }
      );

      if (error) {
        logger.error("Failed to upsert steps", {
          userId: user.id,
          error: error.message,
        });
        setSteps(steps);
        return;
      }

      if (newSteps >= goal && steps < goal) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setBestStreak((prev) => Math.max(prev, nextStreak));
      }
    },
    [user, steps, goal, streak]
  );

  const setGoal = useCallback(
    async (newGoal: number) => {
      if (!user) return;
      const safeGoal = sanitizeGoal(newGoal);
      setGoalState(safeGoal);
      const today = getLocalDateString();

      const { error } = await supabase.from("daily_steps").upsert(
        { user_id: user.id, date: today, steps, goal: safeGoal },
        { onConflict: "user_id,date" }
      );

      if (error) {
        logger.error("Failed to update goal", {
          userId: user.id,
          error: error.message,
        });
      }
    },
    [user, steps]
  );

  const rewards = useMemo(() => buildRewards(streak, bestStreak), [streak, bestStreak]);

  return {
    steps,
    goal,
    streak,
    bestStreak,
    progress,
    goalReached,
    rewards,
    addSteps,
    setGoal,
    loading,
  };
}
