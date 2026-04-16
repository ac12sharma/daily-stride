import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface DayData {
  date: string;
  steps: number;
  goal: number;
}

export function useStats() {
  const { user } = useAuth();
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [avgSteps, setAvgSteps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const fromDate = sevenDaysAgo.toISOString().split("T")[0];

      const { data } = await supabase
        .from("daily_steps")
        .select("date, steps, goal")
        .eq("user_id", user.id)
        .gte("date", fromDate)
        .order("date", { ascending: true });

      if (data) {
        setWeekData(data);
        const total = data.reduce((sum, d) => sum + d.steps, 0);
        setTotalSteps(total);
        setAvgSteps(data.length > 0 ? Math.round(total / data.length) : 0);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  return { weekData, totalSteps, avgSteps, loading };
}
