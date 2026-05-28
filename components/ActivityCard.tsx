import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Radius } from "@/lib/colors";
import {
  formatDistance,
  formatDuration,
  formatPace,
  formatRelativeTime,
  sportLabel,
  paceLabel,
  paceUnit,
} from "@/lib/formatters";
import RouteMap from "./RouteMap";
import SportIcon from "./SportIcon";
import type { Activity } from "@/types";
import * as Haptics from "expo-haptics";

interface Props {
  activity: Activity;
  onKudo: (id: string, hasKudo: boolean) => void;
}

export default function ActivityCard({ activity, onKudo }: Props) {
  const router = useRouter();
  const coords = Array.isArray(activity.route) ? (activity.route as any[]).map((c) => ({
    latitude: c.latitude,
    longitude: c.longitude,
    altitude: c.altitude,
  })) : [];

  const isPaceActivity = activity.sport_type === "run" ||
    activity.sport_type === "walk" ||
    activity.sport_type === "hike";

  const speed = activity.average_speed;
  const statValue = isPaceActivity
    ? formatPace(speed)
    : `${(speed * 3.6).toFixed(1)}`;
  const statUnit = paceUnit(activity.sport_type as any);

  const handleKudo = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onKudo(activity.id, activity.has_kudos ?? false);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/activity/${activity.id}`)}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push(`/profile/${activity.user_id}`)}
          style={styles.avatarRow}
        >
          <View style={styles.avatar}>
            {activity.profile?.avatar_url ? (
              <Image source={{ uri: activity.profile.avatar_url }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarInitial}>
                {activity.profile?.display_name?.[0]?.toUpperCase() ?? "?"}
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.name} numberOfLines={1}>
              {activity.profile?.display_name ?? "Athlete"}
            </Text>
            <Text style={styles.meta}>
              {formatRelativeTime(activity.start_time)} · {sportLabel(activity.sport_type as any)}
            </Text>
          </View>
        </TouchableOpacity>
        <SportIcon type={activity.sport_type as any} size={18} />
      </View>

      {/* Activity title */}
      <Text style={styles.title} numberOfLines={1}>{activity.name}</Text>

      {/* Map */}
      {coords.length > 1 && (
        <View style={styles.mapContainer}>
          <RouteMap coordinates={coords} height={160} />
        </View>
      )}

      {/* Stats row */}
      <View style={styles.stats}>
        <StatItem
          label="Distance"
          value={formatDistance(activity.distance)}
          unit="km"
        />
        <View style={styles.divider} />
        <StatItem
          label={paceLabel(activity.sport_type as any)}
          value={statValue}
          unit={statUnit}
        />
        <View style={styles.divider} />
        <StatItem
          label="Time"
          value={formatDuration(activity.moving_time)}
          unit=""
        />
        {activity.total_elevation_gain > 5 && (
          <>
            <View style={styles.divider} />
            <StatItem
              label="Elev"
              value={`${Math.round(activity.total_elevation_gain)}`}
              unit="m"
            />
          </>
        )}
      </View>

      {/* Kudo + Comment */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleKudo} activeOpacity={0.7}>
          <Ionicons
            name={activity.has_kudos ? "heart" : "heart-outline"}
            size={22}
            color={activity.has_kudos ? Colors.orange : Colors.textSecondary}
          />
          {(activity.kudos_count ?? 0) > 0 && (
            <Text style={[styles.actionCount, activity.has_kudos && styles.kudoActive]}>
              {activity.kudos_count}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/activity/${activity.id}`)}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={20} color={Colors.textSecondary} />
          {(activity.comment_count ?? 0) > 0 && (
            <Text style={styles.actionCount}>{activity.comment_count}</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function StatItem({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        {unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    paddingBottom: 6,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  avatarInitial: { color: Colors.text, fontSize: 16, fontWeight: "700" },
  name: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  meta: { color: Colors.textMuted, fontSize: 12, marginTop: 1 },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  mapContainer: { marginBottom: 12 },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValueRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  statValue: { color: Colors.text, fontSize: 17, fontWeight: "700" },
  statUnit: { color: Colors.textSecondary, fontSize: 11 },
  statLabel: { color: Colors.textMuted, fontSize: 10, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  divider: { width: 1, height: 32, backgroundColor: Colors.border },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  actionCount: { color: Colors.textSecondary, fontSize: 13, fontWeight: "600" },
  kudoActive: { color: Colors.orange },
});
