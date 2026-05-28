import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Activity, Comment } from "@/types";
import { useAuth } from "./useAuth";

export function useActivity(activityId: string) {
  const { user } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    const [actRes, commentsRes] = await Promise.all([
      supabase.from("activities").select("*").eq("id", activityId).single(),
      supabase
        .from("comments")
        .select("*")
        .eq("activity_id", activityId)
        .order("created_at", { ascending: true }),
    ]);

    if (actRes.data) {
      const act = actRes.data;
      const [profileRes, kudosRes, myKudosRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", act.user_id).single(),
        supabase.from("kudos").select("id").eq("activity_id", activityId),
        user
          ? supabase
              .from("kudos")
              .select("id")
              .eq("activity_id", activityId)
              .eq("user_id", user.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      setActivity({
        ...(act as Activity),
        profile: profileRes.data as Activity["profile"],
        kudos_count: kudosRes.data?.length ?? 0,
        has_kudos: !!myKudosRes.data,
      });
    }

    if (commentsRes.data) {
      const userIds = [...new Set(commentsRes.data.map((c) => c.user_id))];
      const profilesRes = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);
      const profileMap = new Map(
        (profilesRes.data ?? []).map((p) => [p.user_id, p])
      );
      setComments(
        commentsRes.data.map((c) => ({
          ...(c as Comment),
          profile: profileMap.get(c.user_id) as Comment["profile"],
        }))
      );
    }

    setLoading(false);
  }, [activityId, user]);

  const toggleKudo = useCallback(async () => {
    if (!user || !activity) return;
    const kudoed = activity.has_kudos;
    setActivity((a) =>
      a
        ? {
            ...a,
            has_kudos: !kudoed,
            kudos_count: (a.kudos_count ?? 0) + (kudoed ? -1 : 1),
          }
        : a
    );
    if (kudoed) {
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
  }, [user, activity, activityId]);

  const addComment = useCallback(
    async (content: string) => {
      if (!user || !content.trim()) return;
      const { data } = await supabase
        .from("comments")
        .insert({ activity_id: activityId, user_id: user.id, content: content.trim() })
        .select("*")
        .single();
      if (data) {
        const profileRes = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setComments((prev) => [
          ...prev,
          { ...(data as Comment), profile: profileRes.data as Comment["profile"] },
        ]);
      }
    },
    [user, activityId]
  );

  return { activity, comments, loading, load, toggleKudo, addComment };
}
