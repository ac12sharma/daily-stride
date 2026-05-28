import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Activity } from "@/types";
import { useAuth } from "./useAuth";

export function useFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE = 20;

  const load = useCallback(
    async (offset = 0, replace = true) => {
      if (!user) return;
      if (offset === 0) replace ? setLoading(true) : setRefreshing(true);

      // Get the IDs of people the current user follows
      const { data: followed } = await supabase
        .from("followers")
        .select("following_id")
        .eq("follower_id", user.id);

      const followedIds = (followed ?? []).map((f) => f.following_id);
      const feedIds = [...followedIds, user.id];

      const { data: acts } = await supabase
        .from("activities")
        .select("*")
        .in("user_id", feedIds)
        .eq("is_private", false)
        .order("start_time", { ascending: false })
        .range(offset, offset + PAGE - 1);

      if (!acts) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Enrich with profiles, kudos counts
      const userIds = [...new Set(acts.map((a) => a.user_id))];
      const activityIds = acts.map((a) => a.id);

      const [profilesRes, kudosRes, myKudosRes] = await Promise.all([
        supabase.from("profiles").select("*").in("user_id", userIds),
        supabase
          .from("kudos")
          .select("activity_id")
          .in("activity_id", activityIds),
        supabase
          .from("kudos")
          .select("activity_id")
          .in("activity_id", activityIds)
          .eq("user_id", user.id),
      ]);

      const profileMap = new Map(
        (profilesRes.data ?? []).map((p) => [p.user_id, p])
      );
      const kudosCountMap = new Map<string, number>();
      (kudosRes.data ?? []).forEach((k) => {
        kudosCountMap.set(k.activity_id, (kudosCountMap.get(k.activity_id) ?? 0) + 1);
      });
      const myKudosSet = new Set(
        (myKudosRes.data ?? []).map((k) => k.activity_id)
      );

      const enriched: Activity[] = acts.map((a) => ({
        ...(a as Activity),
        profile: profileMap.get(a.user_id) as Activity["profile"] ?? null,
        kudos_count: kudosCountMap.get(a.id) ?? 0,
        has_kudos: myKudosSet.has(a.id),
      }));

      setActivities((prev) => (replace ? enriched : [...prev, ...enriched]));
      setHasMore(acts.length === PAGE);
      setLoading(false);
      setRefreshing(false);
    },
    [user]
  );

  const refresh = useCallback(() => load(0, true), [load]);

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    load(activities.length, false);
  }, [activities.length, hasMore, load]);

  const toggleKudo = useCallback(
    async (activityId: string, currentlyKudoed: boolean) => {
      if (!user) return;

      // Optimistic update
      setActivities((prev) =>
        prev.map((a) =>
          a.id === activityId
            ? {
                ...a,
                has_kudos: !currentlyKudoed,
                kudos_count: (a.kudos_count ?? 0) + (currentlyKudoed ? -1 : 1),
              }
            : a
        )
      );

      if (currentlyKudoed) {
        await supabase
          .from("kudos")
          .delete()
          .eq("activity_id", activityId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("kudos")
          .insert({ activity_id: activityId, user_id: user.id });
      }
    },
    [user]
  );

  return { activities, loading, refreshing, hasMore, load, refresh, loadMore, toggleKudo };
}
