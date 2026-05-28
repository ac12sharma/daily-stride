import { useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, Radius } from "@/lib/colors";
import { useProfile } from "@/hooks/useProfile";
import { formatDistance, formatDuration, formatRelativeTime } from "@/lib/formatters";
import SportIcon from "@/components/SportIcon";
import Button from "@/components/ui/Button";
import type { Activity } from "@/types";

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, activities, isFollowing, isOwnProfile, loading, load, toggleFollow } = useProfile(id);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => { if (id) load(); }, [id, load]);

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
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
    >
      {/* Back */}
      <View style={[styles.navBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {profile?.display_name ?? "Athlete"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Avatar */}
      <View style={styles.hero}>
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
        <Text style={styles.name}>{profile?.display_name ?? "Athlete"}</Text>
        {profile?.city && (
          <Text style={styles.location}>{profile.city}</Text>
        )}
        {profile?.bio && (
          <Text style={styles.bio}>{profile.bio}</Text>
        )}

        {!isOwnProfile && (
          <Button
            label={isFollowing ? "Following" : "Follow"}
            onPress={toggleFollow}
            variant={isFollowing ? "secondary" : "primary"}
            size="sm"
            style={{ marginTop: 12, minWidth: 110 }}
          />
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatItem label="Activities" value={String(profile?.activity_count ?? 0)} />
        <View style={styles.statDivider} />
        <StatItem label="Followers" value={String(profile?.follower_count ?? 0)} />
        <View style={styles.statDivider} />
        <StatItem label="Following" value={String(profile?.following_count ?? 0)} />
        <View style={styles.statDivider} />
        <StatItem
          label="Distance"
          value={`${formatDistance(profile?.total_distance ?? 0)}`}
          unit="km"
        />
      </View>

      {/* Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activities</Text>
        {activities.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No public activities</Text>
          </View>
        ) : (
          activities.map((a) => (
            <ActivityRow
              key={a.id}
              activity={a}
              onPress={() => router.push(`/activity/${a.id}`)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

function StatItem({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        {unit && <Text style={styles.statUnit}>{unit}</Text>}
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: { flex: 1, color: Colors.text, fontSize: 17, fontWeight: "700", textAlign: "center" },
  hero: { alignItems: "center", paddingHorizontal: 24, paddingBottom: 20 },
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
  name: { color: Colors.text, fontSize: 22, fontWeight: "700" },
  location: { color: Colors.textMuted, fontSize: 13, marginTop: 4 },
  bio: { color: Colors.textSecondary, fontSize: 14, textAlign: "center", lineHeight: 20, marginTop: 6 },
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
  section: { paddingHorizontal: 16 },
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
  empty: { paddingVertical: 24, alignItems: "center" },
  emptyText: { color: Colors.textMuted, fontSize: 14 },
});
