import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  steps: number;
}

export function useLeaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLeaderboard = async () => {
      const today = new Date().toISOString().slice(0, 10);

      const { data } = await supabase
        .from("daily_steps")
        .select("user_id, steps")
        .eq("date", today)
        .order("steps", { ascending: false })
        .limit(50);

      if (!data || data.length === 0) {
        setEntries([]);
        setLoading(false);
        return;
      }

      // Fetch profiles for these users
      const userIds = data.map(d => d.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map(
        (profiles || []).map(p => [p.user_id, p])
      );

      const result: LeaderboardEntry[] = data.map(d => ({
        user_id: d.user_id,
        steps: d.steps,
        display_name: profileMap.get(d.user_id)?.display_name || null,
        avatar_url: profileMap.get(d.user_id)?.avatar_url || null,
      }));

      setEntries(result);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [user]);

  return { entries, loading };
}
