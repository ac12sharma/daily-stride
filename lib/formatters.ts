import type { SportType } from "@/types";

export function formatDistance(meters: number, unit: "km" | "mi" = "km"): string {
  if (unit === "mi") {
    const miles = meters / 1609.344;
    return miles >= 10 ? miles.toFixed(1) : miles.toFixed(2);
  }
  const km = meters / 1000;
  return km >= 10 ? km.toFixed(1) : km.toFixed(2);
}

export function formatDistanceUnit(unit: "km" | "mi" = "km"): string {
  return unit;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatPace(metersPerSecond: number, unit: "km" | "mi" = "km"): string {
  if (metersPerSecond <= 0) return "--:--";
  const metersPerUnit = unit === "km" ? 1000 : 1609.344;
  const secondsPerUnit = metersPerUnit / metersPerSecond;
  const mins = Math.floor(secondsPerUnit / 60);
  const secs = Math.round(secondsPerUnit % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function formatSpeed(metersPerSecond: number, unit: "km" | "mi" = "km"): string {
  if (metersPerSecond <= 0) return "0.0";
  const factor = unit === "km" ? 3.6 : 2.237;
  return (metersPerSecond * factor).toFixed(1);
}

export function formatElevation(meters: number): string {
  if (Math.abs(meters) >= 1000) return `${(meters / 1000).toFixed(1)}km`;
  return `${Math.round(meters)}m`;
}

export function formatCalories(cal: number): string {
  if (cal >= 1000) return `${(cal / 1000).toFixed(1)}k`;
  return String(Math.round(cal));
}

export function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return new Date(isoString).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  });
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatHeartRate(bpm: number): string {
  return `${Math.round(bpm)} bpm`;
}

export function sportLabel(type: SportType): string {
  const labels: Record<SportType, string> = {
    run: "Run",
    ride: "Ride",
    walk: "Walk",
    hike: "Hike",
    swim: "Swim",
  };
  return labels[type] ?? type;
}

export function paceLabel(type: SportType): string {
  return type === "ride" || type === "swim" ? "Speed" : "Pace";
}

export function paceUnit(type: SportType, unit: "km" | "mi" = "km"): string {
  if (type === "ride" || type === "swim") return unit === "km" ? "km/h" : "mph";
  return `/${unit}`;
}

/** Compute distance between two coordinates using Haversine formula (returns meters) */
export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
