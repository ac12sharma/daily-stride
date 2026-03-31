import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { getLocalDateString } from "@/lib/activity";
import { logger } from "@/lib/logger";

interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  steps: number;
}

export type LeaderboardMode = "local" | "friends";

export function useLeaderboard(mode: LeaderboardMode = "local") {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      setLoading(true);

      try {
        const today = getLocalDateString();
        let allowedUserIds: string[] | null = null;

        if (mode === "friends") {
          const { data: friendships, error: friendshipError } = await supabase
            .from("friendships")
            .select("requester_id, addressee_id")
            .eq("status", "accepted")
            .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

          if (friendshipError) throw friendshipError;

          const friendSet = new Set<string>([user.id]);
          (friendships ?? []).forEach((friendship) => {
            friendSet.add(friendship.requester_id === user.id ? friendship.addressee_id : friendship.requester_id);
          });

          allowedUserIds = [...friendSet];

          if (allowedUserIds.length === 0) {
            setEntries([]);
            return;
          }
        }

        let query = supabase
          .from("daily_steps")
          .select("user_id, steps")
          .eq("date", today)
          .order("steps", { ascending: false })
          .limit(50);

        if (allowedUserIds) {
          query = query.in("user_id", allowedUserIds);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (!data || data.length === 0) {
          setEntries([]);
          return;
        }

        const userIds = data.map((d) => d.user_id);
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("user_id, display_name, avatar_url")
          .in("user_id", userIds);

        if (profileError) throw profileError;

        const profileMap = new Map((profiles || []).map((profile) => [profile.user_id, profile]));

        const result: LeaderboardEntry[] = data.map((entry) => ({
          user_id: entry.user_id,
          steps: entry.steps,
          display_name: profileMap.get(entry.user_id)?.display_name || null,
          avatar_url: profileMap.get(entry.user_id)?.avatar_url || null,
        }));

        setEntries(result);
      } catch (error) {
        logger.error("Failed to load leaderboard", {
          userId: user.id,
          mode,
          error: error instanceof Error ? error.message : String(error),
        });
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchLeaderboard();
  }, [user, mode]);

  return { entries, loading };
}
