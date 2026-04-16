import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Friend {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  friendship_id: string;
  status: string;
  steps_today: number;
  is_requester: boolean;
}

export interface SearchResult {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  already_friend: boolean;
}

export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFriends = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: friendships } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (!friendships || friendships.length === 0) {
      setFriends([]);
      setPendingRequests([]);
      setLoading(false);
      return;
    }

    const otherIds = friendships.map((f) =>
      f.requester_id === user.id ? f.addressee_id : f.requester_id
    );

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .in("user_id", otherIds);

    const today = new Date().toISOString().split("T")[0];
    const { data: stepsData } = await supabase
      .from("daily_steps")
      .select("user_id, steps")
      .in("user_id", otherIds)
      .eq("date", today);

    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
    const stepsMap = new Map((stepsData || []).map((s) => [s.user_id, s.steps]));

    const mapped: Friend[] = friendships.map((f) => {
      const otherId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
      const p = profileMap.get(otherId);
      return {
        user_id: otherId,
        display_name: p?.display_name ?? null,
        avatar_url: p?.avatar_url ?? null,
        friendship_id: f.id,
        status: f.status,
        steps_today: stepsMap.get(otherId) ?? 0,
        is_requester: f.requester_id === user.id,
      };
    });

    setFriends(mapped.filter((f) => f.status === "accepted"));
    setPendingRequests(mapped.filter((f) => f.status === "pending" && !f.is_requester));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const searchUsers = useCallback(
    async (query: string): Promise<SearchResult[]> => {
      if (!user || query.length < 2) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .neq("user_id", user.id)
        .ilike("display_name", `%${query}%`)
        .limit(10);

      if (!profiles) return [];

      const { data: existingFriendships } = await supabase
        .from("friendships")
        .select("requester_id, addressee_id")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      const friendIds = new Set(
        (existingFriendships || []).map((f) =>
          f.requester_id === user.id ? f.addressee_id : f.requester_id
        )
      );

      return profiles.map((p) => ({
        user_id: p.user_id,
        display_name: p.display_name,
        avatar_url: p.avatar_url,
        already_friend: friendIds.has(p.user_id),
      }));
    },
    [user]
  );

  const sendRequest = useCallback(
    async (addresseeId: string) => {
      if (!user) return;
      await supabase.from("friendships").insert({
        requester_id: user.id,
        addressee_id: addresseeId,
      });
      await loadFriends();
    },
    [user, loadFriends]
  );

  const acceptRequest = useCallback(
    async (friendshipId: string) => {
      await supabase
        .from("friendships")
        .update({ status: "accepted" })
        .eq("id", friendshipId);
      await loadFriends();
    },
    [loadFriends]
  );

  const declineRequest = useCallback(
    async (friendshipId: string) => {
      await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId);
      await loadFriends();
    },
    [loadFriends]
  );

  const removeFriend = useCallback(
    async (friendshipId: string) => {
      await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId);
      await loadFriends();
    },
    [loadFriends]
  );

  return {
    friends,
    pendingRequests,
    loading,
    searchUsers,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    refresh: loadFriends,
  };
}
