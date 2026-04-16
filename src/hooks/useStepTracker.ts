import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface StepData {
  steps: number;
  goal: number;
  streak: number;
  bestStreak: number;
  goalReached: boolean;
}

export function useStepTracker() {
  const { user } = useAuth();
  const [steps, setSteps] = useState(0);
  const [goal, setGoal] = useState(8000);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [goalReached, setGoalReached] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  // Load today's data
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("daily_steps")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (data) {
        setSteps(data.steps);
        setGoal(data.goal);
        setGoalReached(data.steps >= data.goal);
      }

      // Calculate streak
      const { data: history } = await supabase
        .from("daily_steps")
        .select("date, steps, goal")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(60);

      if (history) {
        let s = 0;
        const dates = history.filter((d) => d.steps >= d.goal);
        for (let i = 0; i < dates.length; i++) {
          const expected = new Date();
          expected.setDate(expected.getDate() - i);
          const exp = expected.toISOString().split("T")[0];
          if (dates[i]?.date === exp) s++;
          else break;
        }
        setStreak(s);
        setBestStreak(Math.max(s, bestStreak));
      }
      setLoading(false);
    };
    load();
  }, [user, today]);

  const addSteps = useCallback(
    async (amount: number) => {
      if (!user) return;
      const newSteps = steps + amount;
      setSteps(newSteps);
      const reached = newSteps >= goal;
      setGoalReached(reached);

      if (reached && !goalReached) {
        setStreak((s) => s + 1);
        setBestStreak((b) => Math.max(b, streak + 1));
      }

      await supabase.from("daily_steps").upsert(
        {
          user_id: user.id,
          date: today,
          steps: newSteps,
          goal,
        },
        { onConflict: "user_id,date" }
      );
    },
    [user, steps, goal, goalReached, streak, today]
  );

  const changeGoal = useCallback(
    async (newGoal: number) => {
      if (!user) return;
      setGoal(newGoal);
      setGoalReached(steps >= newGoal);

      await supabase.from("daily_steps").upsert(
        {
          user_id: user.id,
          date: today,
          steps,
          goal: newGoal,
        },
        { onConflict: "user_id,date" }
      );
    },
    [user, steps, today]
  );

  return {
    steps,
    goal,
    streak,
    bestStreak,
    goalReached,
    loading,
    addSteps,
    changeGoal,
  };
}
