import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const BADGE_DEFINITIONS = [
  { id: "first-step", title: "First Step", description: "Complete 1 day", icon: "🔥", requiredStreak: 1 },
  { id: "hat-trick", title: "Hat Trick", description: "3-day streak", icon: "⚡", requiredStreak: 3 },
  { id: "weekly-warrior", title: "Weekly Warrior", description: "7-day streak", icon: "🏆", requiredStreak: 7 },
  { id: "iron-will", title: "Iron Will", description: "14-day streak", icon: "💎", requiredStreak: 14 },
  { id: "unstoppable", title: "Unstoppable", description: "30-day streak", icon: "👑", requiredStreak: 30 },
  { id: "step-master", title: "Step Master", description: "10k steps in a day", icon: "🏃", requiredStreak: 0 },
  { id: "marathon", title: "Marathon", description: "42k steps in a week", icon: "🥇", requiredStreak: 0 },
  { id: "centurion", title: "Centurion", description: "100-day streak", icon: "💫", requiredStreak: 100 },
  { id: "legend", title: "Legend", description: "365-day streak", icon: "🌟", requiredStreak: 365 },
];

export function useBadges() {
  const { user } = useAuth();
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBadges = async () => {
      const { data } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", user.id);

      setUnlockedBadgeIds(new Set((data || []).map(b => b.badge_id)));
      setLoading(false);
    };

    fetchBadges();
  }, [user]);

  return { unlockedBadgeIds, loading };
}
