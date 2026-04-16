import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const BADGE_DEFS = [
  { id: "first_step", name: "First Step", desc: "Complete your first goal", icon: "👟", requirement: 1 },
  { id: "consistency_3", name: "Consistent", desc: "3-day streak", icon: "🔥", requirement: 3 },
  { id: "momentum_7", name: "Momentum", desc: "7-day streak", icon: "⚡", requirement: 7 },
  { id: "discipline_14", name: "Discipline", desc: "14-day streak", icon: "💪", requirement: 14 },
  { id: "champion_30", name: "Champion", desc: "30-day streak", icon: "🏆", requirement: 30 },
  { id: "steps_50k", name: "50K Walker", desc: "50,000 total steps", icon: "🥾", requirement: -1 },
  { id: "steps_100k", name: "100K Explorer", desc: "100,000 total steps", icon: "🌍", requirement: -1 },
  { id: "steps_500k", name: "500K Legend", desc: "500,000 total steps", icon: "🌟", requirement: -1 },
  { id: "early_bird", name: "Early Bird", desc: "Complete goal before noon", icon: "🐦", requirement: -1 },
];

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export function useBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: unlocked } = await supabase
        .from("user_badges")
        .select("badge_id, unlocked_at")
        .eq("user_id", user.id);

      const unlockedMap = new Map(
        (unlocked || []).map((b) => [b.badge_id, b.unlocked_at])
      );

      setBadges(
        BADGE_DEFS.map((def) => ({
          ...def,
          unlocked: unlockedMap.has(def.id),
          unlockedAt: unlockedMap.get(def.id) ?? undefined,
        }))
      );
      setLoading(false);
    };
    load();
  }, [user]);

  return { badges, loading };
}
