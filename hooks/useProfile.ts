import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Activity, Profile } from "@/types";
import { useAuth } from "./useAuth";

export function useProfile(userId?: string) {
  const { user } = useAuth();
  const targetId = userId ?? user?.id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!targetId) return;
    setLoading(true);

    const [profileRes, activitiesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", targetId).single(),
      supabase
        .from("activities")
        .select("*")
        .eq("user_id", targetId)
        .eq("is_private", false)
        .order("start_time", { ascending: false })
        .limit(30),
    ]);

    if (profileRes.data) {
      // Enrich with follower/following counts
      const [followerRes, followingRes] = await Promise.all([
        supabase
          .from("followers")
          .select("id", { count: "exact", head: true })
          .eq("following_id", targetId),
        supabase
          .from("followers")
          .select("id", { count: "exact", head: true })
          .eq("follower_id", targetId),
      ]);

      const totalDist = (activitiesRes.data ?? []).reduce(
        (sum, a) => sum + a.distance,
        0
      );

      setProfile({
        ...(profileRes.data as Profile),
        follower_count: followerRes.count ?? 0,
        following_count: followingRes.count ?? 0,
        activity_count: activitiesRes.data?.length ?? 0,
        total_distance: totalDist,
      });
    }

    setActivities((activitiesRes.data ?? []) as Activity[]);

    // Check if current user follows this profile
    if (user && targetId !== user.id) {
      const { data: follows } = await supabase
        .from("followers")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", targetId)
        .maybeSingle();
      setIsFollowing(!!follows);
    }

    setLoading(false);
  }, [targetId, user]);

  const toggleFollow = useCallback(async () => {
    if (!user || !targetId || targetId === user.id) return;

    if (isFollowing) {
      setIsFollowing(false);
      setProfile((p) => p ? { ...p, follower_count: Math.max(0, (p.follower_count ?? 1) - 1) } : p);
      await supabase
        .from("followers")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetId);
    } else {
      setIsFollowing(true);
      setProfile((p) => p ? { ...p, follower_count: (p.follower_count ?? 0) + 1 } : p);
      await supabase
        .from("followers")
        .insert({ follower_id: user.id, following_id: targetId });
    }
  }, [user, targetId, isFollowing]);

  const isOwnProfile = user?.id === targetId;

  return { profile, activities, isFollowing, isOwnProfile, loading, load, toggleFollow };
}
