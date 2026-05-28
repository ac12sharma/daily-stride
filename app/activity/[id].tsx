import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, KeyboardAvoidingView,
  Platform, Image, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Colors, Radius } from "@/lib/colors";
import { useActivity } from "@/hooks/useActivity";
import {
  formatDistance, formatDuration, formatPace, formatSpeed,
  formatElevation, formatDate, sportLabel, paceLabel, paceUnit,
} from "@/lib/formatters";
import RouteMap from "@/components/RouteMap";
import SportIcon from "@/components/SportIcon";
import type { Comment } from "@/types";

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activity, comments, loading, load, toggleKudo, addComment } = useActivity(id);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (id) load(); }, [id, load]);

  const handleKudo = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleKudo();
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    await addComment(comment);
    setComment("");
    setSubmitting(false);
  };

  if (loading || !activity) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={Colors.orange} size="large" />
      </View>
    );
  }

  const coords = Array.isArray(activity.route)
    ? (activity.route as any[]).map((c) => ({
        latitude: c.latitude,
        longitude: c.longitude,
        altitude: c.altitude,
      }))
    : [];

  const isPaceActivity =
    activity.sport_type === "run" ||
    activity.sport_type === "walk" ||
    activity.sport_type === "hike";

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Map hero */}
        <View style={styles.mapHero}>
          <RouteMap coordinates={coords} height={280} />
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { top: insets.top + 12 }]}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Activity info */}
        <View style={styles.body}>
          {/* Athlete */}
          <TouchableOpacity
            style={styles.athleteRow}
            onPress={() => router.push(`/profile/${activity.user_id}`)}
          >
            <View style={styles.athleteAvatar}>
              {activity.profile?.avatar_url ? (
                <Image source={{ uri: activity.profile.avatar_url }} style={styles.athleteAvatarImg} />
              ) : (
                <Text style={styles.athleteInitial}>
                  {activity.profile?.display_name?.[0]?.toUpperCase() ?? "?"}
                </Text>
              )}
            </View>
            <View>
              <Text style={styles.athleteName}>{activity.profile?.display_name ?? "Athlete"}</Text>
              <Text style={styles.actDate}>{formatDate(activity.start_time)}</Text>
            </View>
            <SportIcon type={activity.sport_type as any} size={18} style={{ marginLeft: "auto" }} />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.actTitle}>{activity.name}</Text>
          {activity.description && (
            <Text style={styles.actDesc}>{activity.description}</Text>
          )}

          {/* Primary stats */}
          <View style={styles.statsGrid}>
            <StatCell
              label="Distance"
              value={formatDistance(activity.distance)}
              unit="km"
              big
            />
            <StatCell
              label={paceLabel(activity.sport_type as any)}
              value={
                isPaceActivity
                  ? formatPace(activity.average_speed)
                  : formatSpeed(activity.average_speed)
              }
              unit={paceUnit(activity.sport_type as any)}
              big
            />
            <StatCell
              label="Moving Time"
              value={formatDuration(activity.moving_time)}
              unit=""
              big
            />
          </View>

          {/* Secondary stats */}
          <View style={styles.secondaryStats}>
            <StatRow label="Elapsed Time" value={formatDuration(activity.elapsed_time)} />
            <StatRow label="Elevation Gain" value={formatElevation(activity.total_elevation_gain)} />
            <StatRow label="Max Speed" value={`${formatSpeed(activity.max_speed)} ${paceUnit(activity.sport_type as any)}`} />
            {activity.calories && (
              <StatRow label="Calories" value={`${activity.calories} kcal`} />
            )}
            {activity.average_heart_rate && (
              <StatRow label="Avg Heart Rate" value={`${activity.average_heart_rate} bpm`} />
            )}
            {activity.max_heart_rate && (
              <StatRow label="Max Heart Rate" value={`${activity.max_heart_rate} bpm`} />
            )}
          </View>

          {/* Kudo bar */}
          <View style={styles.kudoBar}>
            <TouchableOpacity onPress={handleKudo} style={styles.kudoBtn} activeOpacity={0.7}>
              <Ionicons
                name={activity.has_kudos ? "heart" : "heart-outline"}
                size={24}
                color={activity.has_kudos ? Colors.orange : Colors.textSecondary}
              />
              <Text style={[styles.kudoCount, activity.has_kudos && styles.kudoCountActive]}>
                {activity.kudos_count ?? 0}{" "}
                <Text style={styles.kudoLabel}>
                  {(activity.kudos_count ?? 0) === 1 ? "Kudo" : "Kudos"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Comments */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Comments{comments.length > 0 ? ` (${comments.length})` : ""}
            </Text>
            {comments.map((c) => (
              <CommentRow key={c.id} comment={c} />
            ))}

            {/* Add comment */}
            <View style={styles.commentInput}>
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Add a comment..."
                placeholderTextColor={Colors.textMuted}
                style={styles.commentField}
                returnKeyType="send"
                onSubmitEditing={handleComment}
              />
              <TouchableOpacity
                onPress={handleComment}
                disabled={!comment.trim() || submitting}
                style={[styles.commentSend, (!comment.trim() || submitting) && { opacity: 0.4 }]}
              >
                <Ionicons name="send" size={18} color={Colors.orange} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function StatCell({ label, value, unit, big }: { label: string; value: string; unit: string; big?: boolean }) {
  return (
    <View style={styles.statCell}>
      <View style={styles.statCellValueRow}>
        <Text style={[styles.statCellValue, big && styles.statCellValueBig]}>{value}</Text>
        {unit ? <Text style={styles.statCellUnit}>{unit}</Text> : null}
      </View>
      <Text style={styles.statCellLabel}>{label}</Text>
    </View>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statRowLabel}>{label}</Text>
      <Text style={styles.statRowValue}>{value}</Text>
    </View>
  );
}

function CommentRow({ comment }: { comment: Comment }) {
  return (
    <View style={styles.commentRow}>
      <View style={styles.commentAvatar}>
        {comment.profile?.avatar_url ? (
          <Image source={{ uri: comment.profile.avatar_url }} style={styles.commentAvatarImg} />
        ) : (
          <Text style={styles.commentAvatarInitial}>
            {comment.profile?.display_name?.[0]?.toUpperCase() ?? "?"}
          </Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.commentName}>{comment.profile?.display_name ?? "Athlete"}</Text>
        <Text style={styles.commentContent}>{comment.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  center: { alignItems: "center", justifyContent: "center" },
  mapHero: { position: "relative" },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: 20 },
  athleteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  athleteAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  athleteAvatarImg: { width: "100%", height: "100%" },
  athleteInitial: { color: Colors.text, fontSize: 18, fontWeight: "700" },
  athleteName: { color: Colors.text, fontSize: 15, fontWeight: "600" },
  actDate: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  actTitle: { color: Colors.text, fontSize: 22, fontWeight: "800", marginBottom: 6 },
  actDesc: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 16 },
  statsGrid: {
    flexDirection: "row",
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  statCell: { flex: 1, alignItems: "center", paddingVertical: 16 },
  statCellValueRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  statCellValue: { color: Colors.text, fontSize: 20, fontWeight: "800" },
  statCellValueBig: { fontSize: 22 },
  statCellUnit: { color: Colors.textSecondary, fontSize: 11 },
  statCellLabel: { color: Colors.textMuted, fontSize: 10, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5 },
  secondaryStats: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: "hidden",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  statRowLabel: { color: Colors.textSecondary, fontSize: 14 },
  statRowValue: { color: Colors.text, fontSize: 14, fontWeight: "600" },
  kudoBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  kudoBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  kudoCount: { color: Colors.textSecondary, fontSize: 16, fontWeight: "600" },
  kudoCountActive: { color: Colors.orange },
  kudoLabel: { fontWeight: "400", fontSize: 14 },
  commentsSection: {},
  commentsTitle: { color: Colors.text, fontSize: 16, fontWeight: "700", marginBottom: 12 },
  commentRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  commentAvatarImg: { width: "100%", height: "100%" },
  commentAvatarInitial: { color: Colors.text, fontSize: 14, fontWeight: "700" },
  commentName: { color: Colors.text, fontSize: 13, fontWeight: "600", marginBottom: 3 },
  commentContent: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  commentField: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentSend: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
});
