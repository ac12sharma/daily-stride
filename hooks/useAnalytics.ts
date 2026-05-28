import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Activity, SportType } from "@/types";
import { useAuth } from "./useAuth";

export interface WeekSummary {
  weekLabel: string;
  distance: number;
  movingTime: number;
  elevationGain: number;
  count: number;
}

export interface SportSummary {
  sport_type: SportType;
  distance: number;
  movingTime: number;
  count: number;
}

export interface AnalyticsData {
  weeks: WeekSummary[];
  sports: SportSummary[];
  totalDistance: number;
  totalTime: number;
  totalElevation: number;
  longestActivity: Activity | null;
  fastestPace: number;
  currentStreak: number;
  bestStreak: number;
}

export function useAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (period: "month" | "year" | "all" = "month") => {
      if (!user) return;
      setLoading(true);

      const since = new Date();
      if (period === "month") since.setDate(since.getDate() - 30);
      else if (period === "year") since.setFullYear(since.getFullYear() - 1);
      else since.setFullYear(2000);

      const { data: acts } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .gte("start_time", since.toISOString())
        .order("start_time", { ascending: false });

      if (!acts || acts.length === 0) {
        setData({
          weeks: [],
          sports: [],
          totalDistance: 0,
          totalTime: 0,
          totalElevation: 0,
          longestActivity: null,
          fastestPace: 0,
          currentStreak: 0,
          bestStreak: 0,
        });
        setLoading(false);
        return;
      }

      // Weekly breakdown
      const weekMap = new Map<string, WeekSummary>();
      for (const a of acts) {
        const d = new Date(a.start_time);
        d.setDate(d.getDate() - d.getDay());
        const key = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("en", { month: "short", day: "numeric" });
        const prev = weekMap.get(key) ?? { weekLabel: label, distance: 0, movingTime: 0, elevationGain: 0, count: 0 };
        weekMap.set(key, {
          weekLabel: prev.weekLabel,
          distance: prev.distance + a.distance,
          movingTime: prev.movingTime + a.moving_time,
          elevationGain: prev.elevationGain + a.total_elevation_gain,
          count: prev.count + 1,
        });
      }
      const weeks = Array.from(weekMap.values()).reverse().slice(0, 12);

      // Sport breakdown
      const sportMap = new Map<string, SportSummary>();
      for (const a of acts) {
        const prev = sportMap.get(a.sport_type) ?? { sport_type: a.sport_type as SportType, distance: 0, movingTime: 0, count: 0 };
        sportMap.set(a.sport_type, {
          sport_type: a.sport_type as SportType,
          distance: prev.distance + a.distance,
          movingTime: prev.movingTime + a.moving_time,
          count: prev.count + 1,
        });
      }
      const sports = Array.from(sportMap.values()).sort((a, b) => b.distance - a.distance);

      const totalDistance = acts.reduce((s, a) => s + a.distance, 0);
      const totalTime = acts.reduce((s, a) => s + a.moving_time, 0);
      const totalElevation = acts.reduce((s, a) => s + a.total_elevation_gain, 0);
      const longestActivity = acts.reduce<Activity | null>((max, a) =>
        !max || a.distance > max.distance ? (a as Activity) : max, null);

      // Fastest run pace
      const runs = acts.filter((a) => a.sport_type === "run" && a.distance > 1000);
      const fastestPace = runs.length > 0
        ? Math.min(...runs.map((a) => a.moving_time / (a.distance / 1000)))
        : 0;

      // Activity streak (days with at least one activity)
      const daySet = new Set(acts.map((a) => a.start_time.split("T")[0]));
      let currentStreak = 0;
      let bestStreak = 0;
      let run = 0;
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        if (daySet.has(key)) {
          if (i === 0 || currentStreak > 0) currentStreak++;
          run++;
          bestStreak = Math.max(bestStreak, run);
        } else {
          if (i === 0) currentStreak = 0;
          run = 0;
        }
      }

      setData({ weeks, sports, totalDistance, totalTime, totalElevation, longestActivity, fastestPace, currentStreak, bestStreak });
      setLoading(false);
    },
    [user]
  );

  return { data, loading, load };
}
