import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  user_id: string;
  steps: number;
  display_name: string | null;
  avatar_url: string | null;
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split("T")[0];

      const { data: stepsData } = await supabase
        .from("daily_steps")
        .select("user_id, steps")
        .eq("date", today)
        .order("steps", { ascending: false })
        .limit(50);

      if (!stepsData || stepsData.length === 0) {
        setLoading(false);
        return;
      }

      const userIds = stepsData.map((s) => s.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map(
        (profiles || []).map((p) => [p.user_id, p])
      );

      const merged: LeaderboardEntry[] = stepsData.map((s) => {
        const p = profileMap.get(s.user_id);
        return {
          user_id: s.user_id,
          steps: s.steps,
          display_name: p?.display_name ?? null,
          avatar_url: p?.avatar_url ?? null,
        };
      });

      setEntries(merged);
      setLoading(false);
    };
    load();
  }, []);

  return { entries, loading };
}
