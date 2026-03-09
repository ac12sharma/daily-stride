import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { format, subDays } from "date-fns";

export function useStats() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<{ day: string; steps: number }[]>([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [avgSteps, setAvgSteps] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const today = new Date();
      const weekAgo = subDays(today, 6);

      const { data } = await supabase
        .from("daily_steps")
        .select("date, steps, goal")
        .eq("user_id", user.id)
        .gte("date", format(weekAgo, "yyyy-MM-dd"))
        .order("date", { ascending: true });

      // Build 7-day chart data
      const dayMap = new Map((data || []).map(d => [d.date, d.steps]));
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

      // Fetch all-time stats
      const { data: allData } = await supabase
        .from("daily_steps")
        .select("date, steps, goal")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (allData && allData.length > 0) {
        const total = allData.reduce((sum, d) => sum + d.steps, 0);
        setTotalSteps(total);
        setAvgSteps(Math.round(total / allData.length));

        // Streak calc
        const completed = new Set(allData.filter(d => d.steps >= d.goal).map(d => d.date));
        let streak = 0;
        const check = new Date();
        const todayStr = format(check, "yyyy-MM-dd");
        if (!completed.has(todayStr)) check.setDate(check.getDate() - 1);

        while (completed.has(format(check, "yyyy-MM-dd"))) {
          streak++;
          check.setDate(check.getDate() - 1);
        }
        setCurrentStreak(streak);

        const sorted = [...completed].sort();
        let best = 0, temp = 0;
        for (let i = 0; i < sorted.length; i++) {
          if (i === 0) { temp = 1; }
          else {
            const prev = new Date(sorted[i - 1]);
            const curr = new Date(sorted[i]);
            temp = (curr.getTime() - prev.getTime()) / 86400000 === 1 ? temp + 1 : 1;
          }
          best = Math.max(best, temp);
        }
        setBestStreak(best);
      }

      setLoading(false);
    };

    fetchStats();
  }, [user]);

  return { weeklyData, totalSteps, avgSteps, currentStreak, bestStreak, loading };
}
