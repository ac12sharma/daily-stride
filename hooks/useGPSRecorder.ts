import { useState, useRef, useCallback, useEffect } from "react";
import * as Location from "expo-location";
import { supabase } from "@/lib/supabase";
import { haversineDistance } from "@/lib/formatters";
import type { Coordinate, SportType } from "@/types";
import { useAuth } from "./useAuth";

export type RecordingState = "idle" | "recording" | "paused" | "saving";

interface GPSStats {
  distance: number;
  elapsed: number;
  moving: number;
  currentSpeed: number;
  averageSpeed: number;
  elevationGain: number;
  coordinates: Coordinate[];
}

const EMPTY_STATS: GPSStats = {
  distance: 0,
  elapsed: 0,
  moving: 0,
  currentSpeed: 0,
  averageSpeed: 0,
  elevationGain: 0,
  coordinates: [],
};

export function useGPSRecorder() {
  const { user } = useAuth();
  const [state, setState] = useState<RecordingState>("idle");
  const [stats, setStats] = useState<GPSStats>(EMPTY_STATS);
  const [hasPermission, setHasPermission] = useState(false);

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const totalPausedRef = useRef<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statsRef = useRef<GPSStats>(EMPTY_STATS);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      setHasPermission(status === "granted");
    });
  }, []);

  const startTimer = useCallback(() => {
    tickRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startTimeRef.current - totalPausedRef.current) / 1000
      );
      setStats((s) => ({ ...s, elapsed }));
    }, 1000);
  }, []);

  const start = useCallback(async () => {
    if (!hasPermission) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      setHasPermission(true);
    }

    startTimeRef.current = Date.now();
    totalPausedRef.current = 0;
    statsRef.current = EMPTY_STATS;
    setStats(EMPTY_STATS);
    setState("recording");
    startTimer();

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 3,
      },
      (loc) => {
        const coord: Coordinate = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          altitude: loc.coords.altitude ?? undefined,
          timestamp: loc.timestamp,
        };

        setStats((prev) => {
          const coords = [...prev.coordinates, coord];
          let dist = prev.distance;
          let elevGain = prev.elevationGain;

          if (coords.length > 1) {
            const last = coords[coords.length - 2];
            dist += haversineDistance(
              last.latitude, last.longitude,
              coord.latitude, coord.longitude
            );
            if (coord.altitude != null && last.altitude != null) {
              const diff = coord.altitude - last.altitude;
              if (diff > 0) elevGain += diff;
            }
          }

          const currentSpeed = loc.coords.speed ?? 0;
          const avgSpeed = prev.moving > 0 ? dist / prev.moving : 0;

          const next: GPSStats = {
            ...prev,
            distance: dist,
            currentSpeed: Math.max(0, currentSpeed),
            averageSpeed: avgSpeed,
            elevationGain: elevGain,
            coordinates: coords,
          };
          statsRef.current = next;
          return next;
        });
      }
    );
  }, [hasPermission, startTimer]);

  const pause = useCallback(() => {
    setState("paused");
    pausedAtRef.current = Date.now();
    if (tickRef.current) clearInterval(tickRef.current);
    watchRef.current?.remove();
  }, []);

  const resume = useCallback(async () => {
    totalPausedRef.current += Date.now() - pausedAtRef.current;
    setState("recording");
    startTimer();

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 3,
      },
      (loc) => {
        const coord: Coordinate = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          altitude: loc.coords.altitude ?? undefined,
          timestamp: loc.timestamp,
        };
        setStats((prev) => {
          const coords = [...prev.coordinates, coord];
          let dist = prev.distance;
          if (coords.length > 1) {
            const last = coords[coords.length - 2];
            dist += haversineDistance(
              last.latitude, last.longitude,
              coord.latitude, coord.longitude
            );
          }
          const next = { ...prev, coordinates: coords, distance: dist };
          statsRef.current = next;
          return next;
        });
      }
    );
  }, [startTimer]);

  const save = useCallback(
    async (sportType: SportType, name: string): Promise<string | null> => {
      if (!user) return null;
      setState("saving");

      if (tickRef.current) clearInterval(tickRef.current);
      watchRef.current?.remove();

      const s = statsRef.current;
      const endTime = new Date().toISOString();
      const startTime = new Date(startTimeRef.current).toISOString();
      const movingTime = Math.max(
        1,
        s.elapsed - Math.floor(totalPausedRef.current / 1000)
      );

      const { data, error } = await supabase
        .from("activities")
        .insert({
          user_id: user.id,
          sport_type: sportType,
          name,
          start_time: startTime,
          end_time: endTime,
          elapsed_time: s.elapsed,
          moving_time: movingTime,
          distance: Math.round(s.distance),
          total_elevation_gain: Math.round(s.elevationGain),
          average_speed: s.averageSpeed,
          max_speed: s.currentSpeed,
          route: s.coordinates,
          is_private: false,
        })
        .select("id")
        .single();

      setState("idle");
      setStats(EMPTY_STATS);
      statsRef.current = EMPTY_STATS;

      if (error || !data) return null;
      return data.id;
    },
    [user]
  );

  const discard = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    watchRef.current?.remove();
    setState("idle");
    setStats(EMPTY_STATS);
    statsRef.current = EMPTY_STATS;
  }, []);

  return {
    state,
    stats,
    hasPermission,
    start,
    pause,
    resume,
    save,
    discard,
  };
}
