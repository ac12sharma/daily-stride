import { useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Radius } from "@/lib/colors";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { formatDistance, formatDuration, sportLabel, formatRelativeTime } from "@/lib/formatters";
import SportIcon from "@/components/SportIcon";
import type { Activity } from "@/types";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { profile, activities, loading, load } = useProfile(user?.id);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={Colors.orange} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 100 }}
    >
      {/* Header actions */}
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>You</Text>
        <TouchableOpacity onPress={() => router.push("/settings")} style={styles.iconBtn}>
          <Ionicons name="settings-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Avatar + Name */}
      <View style={styles.heroSection}>
        <View style={styles.avatarWrap}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {profile?.display_name?.[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
          )}
          {profile?.is_premium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={10} color="#000" />
            </View>
          )}
        </View>
        <Text style={styles.displayName}>
          {profile?.display_name ?? "Athlete"}
        </Text>
        {profile?.city && (
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={13} color={Colors.textMuted} /> {profile.city}
          </Text>
        )}
        {profile?.bio && (
          <Text style={styles.bio}>{profile.bio}</Text>
        )}
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <ProfileStat label="Activities" value={String(profile?.activity_count ?? 0)} />
        <View style={styles.statDivider} />
        <ProfileStat
          label="Following"
          value={String(profile?.following_count ?? 0)}
          onPress={() => router.push("/followers")}
        />
        <View style={styles.statDivider} />
        <ProfileStat
          label="Followers"
          value={String(profile?.follower_count ?? 0)}
          onPress={() => router.push("/followers")}
        />
        <View style={styles.statDivider} />
        <ProfileStat
          label="Distance"
          value={`${formatDistance(profile?.total_distance ?? 0)}`}
          unit="km"
        />
      </View>

      {/* Recent activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {activities.length === 0 ? (
          <View style={styles.emptyActivities}>
            <Text style={styles.emptyText}>No activities yet</Text>
          </View>
        ) : (
          activities.slice(0, 10).map((a) => (
            <ActivityRow
              key={a.id}
              activity={a}
              onPress={() => router.push(`/activity/${a.id}`)}
            />
          ))
        )}
      </View>

      {/* Sign out */}
      <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
        <Ionicons name="log-out-outline" size={18} color={Colors.error} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProfileStat({
  label, value, unit, onPress,
}: {
  label: string; value: string; unit?: string; onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={styles.statItem}
      activeOpacity={0.7}
    >
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        {unit && <Text style={styles.statUnit}>{unit}</Text>}
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function ActivityRow({ activity, onPress }: { activity: Activity; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.actRow} activeOpacity={0.8}>
      <SportIcon type={activity.sport_type as any} size={18} />
      <View style={{ flex: 1 }}>
        <Text style={styles.actName} numberOfLines={1}>{activity.name}</Text>
        <Text style={styles.actMeta}>
          {formatRelativeTime(activity.start_time)} ·{" "}
          {formatDistance(activity.distance)} km ·{" "}
          {formatDuration(activity.moving_time)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  center: { alignItems: "center", justifyContent: "center" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  screenTitle: { color: Colors.text, fontSize: 22, fontWeight: "800" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  heroSection: { alignItems: "center", paddingVertical: 20 },
  avatarWrap: { position: "relative", marginBottom: 12 },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarPlaceholder: {
    backgroundColor: Colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.borderStrong,
  },
  avatarInitial: { color: Colors.text, fontSize: 32, fontWeight: "700" },
  premiumBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.premium,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.bg,
  },
  displayName: { color: Colors.text, fontSize: 22, fontWeight: "700" },
  location: { color: Colors.textMuted, fontSize: 13, marginTop: 4 },
  bio: { color: Colors.textSecondary, fontSize: 14, textAlign: "center", marginTop: 6, paddingHorizontal: 40, lineHeight: 20 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.bgCard,
    marginHorizontal: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 16,
    marginBottom: 20,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValueRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  statValue: { color: Colors.text, fontSize: 18, fontWeight: "800" },
  statUnit: { color: Colors.textSecondary, fontSize: 11 },
  statLabel: { color: Colors.textMuted, fontSize: 10, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.4 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: "700", marginBottom: 10 },
  actRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  actName: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  actMeta: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  emptyActivities: { paddingVertical: 24, alignItems: "center" },
  emptyText: { color: Colors.textMuted, fontSize: 14 },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    backgroundColor: "rgba(244,67,54,0.08)",
    borderWidth: 1,
    borderColor: "rgba(244,67,54,0.2)",
  },
  signOutText: { color: Colors.error, fontSize: 15, fontWeight: "600" },
});
