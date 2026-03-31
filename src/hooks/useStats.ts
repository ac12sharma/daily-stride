import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { format, subDays } from "date-fns";
import { calculateStreaks } from "@/lib/activity";
import { logger } from "@/lib/logger";

export function useStats() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<{ day: string; steps: number }[]>([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [avgSteps, setAvgSteps] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const today = new Date();
        const weekAgo = subDays(today, 6);

        const { data, error } = await supabase
          .from("daily_steps")
          .select("date, steps, goal")
          .eq("user_id", user.id)
          .gte("date", format(weekAgo, "yyyy-MM-dd"))
          .order("date", { ascending: true });

        if (error) throw error;

        const dayMap = new Map((data || []).map((d) => [d.date, d.steps]));
        const weekly = [];
        for (let i = 6; i >= 0; i--) {
          const d = subDays(today, i);
          const dateStr = format(d, "yyyy-MM-dd");
          weekly.push({
            day: format(d, "EEE"),
            steps: dayMap.get(dateStr) || 0,
          });
        }
        setWeeklyData(weekly);

        const { data: allData, error: allError } = await supabase
          .from("daily_steps")
          .select("date, steps, goal")
          .eq("user_id", user.id)
          .order("date", { ascending: false });

        if (allError) throw allError;

        const rows = allData ?? [];
        const total = rows.reduce((sum, d) => sum + d.steps, 0);
        setTotalSteps(total);
        setAvgSteps(rows.length > 0 ? Math.round(total / rows.length) : 0);

        const completedDates = rows.filter((d) => d.steps >= d.goal).map((d) => d.date);
        const { currentStreak: current, bestStreak: best } = calculateStreaks(completedDates);
        setCurrentStreak(current);
        setBestStreak(best);
      } catch (error) {
        logger.error("Failed to load stats", {
          userId: user.id,
          error: error instanceof Error ? error.message : String(error),
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, [user]);

  return { weeklyData, totalSteps, avgSteps, currentStreak, bestStreak, loading };
}
