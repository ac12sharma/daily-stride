import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius } from "@/lib/colors";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatDistance, formatDuration, sportLabel } from "@/lib/formatters";
import PremiumGate from "@/components/PremiumGate";
import { useAuth } from "@/hooks/useAuth";

const { width: SCREEN_W } = Dimensions.get("window");
type Period = "month" | "year" | "all";

export default function TrainingScreen() {
  const { profile } = useAuth();
  const { data, loading, load } = useAnalytics();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>("month");
  const isPremium = profile?.is_premium ?? false;

  useEffect(() => { load(period); }, [period, load]);

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
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Training</Text>
        <View style={styles.periodRow}>
          {(["month", "year", "all"] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
            >
              <Text style={[styles.periodLabel, period === p && styles.periodLabelActive]}>
                {p === "month" ? "30d" : p === "year" ? "1y" : "All"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {!data || data.totalDistance === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="barbell-outline" size={52} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No activities yet</Text>
          <Text style={styles.emptyText}>Record your first workout to see your training data.</Text>
        </View>
      ) : (
        <>
          {/* Totals */}
          <View style={styles.totalsGrid}>
            <TotalCard
              label="Total Distance"
              value={`${formatDistance(data.totalDistance)}`}
              unit="km"
              icon="walk"
            />
            <TotalCard
              label="Total Time"
              value={formatDuration(data.totalTime)}
              unit=""
              icon="time"
            />
            <TotalCard
              label="Elevation"
              value={`${Math.round(data.totalElevation / 1000 * 10) / 10}`}
              unit="km"
              icon="trending-up"
            />
            <TotalCard
              label="Activities"
              value={String(data.sports.reduce((s, sp) => s + sp.count, 0))}
              unit=""
              icon="list"
            />
          </View>

          {/* Streak */}
          <View style={styles.streakCard}>
            <View style={styles.streakItem}>
              <Text style={styles.streakValue}>{data.currentStreak}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakItem}>
              <Text style={styles.streakValue}>{data.bestStreak}</Text>
              <Text style={styles.streakLabel}>Best Streak</Text>
            </View>
            <Ionicons name="flame" size={28} color={Colors.orange} style={{ marginLeft: "auto" }} />
          </View>

          {/* Weekly chart */}
          {data.weeks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weekly Distance</Text>
              <WeeklyChart weeks={data.weeks} />
            </View>
          )}

          {/* Sport breakdown */}
          {data.sports.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>By Sport</Text>
              {data.sports.map((sp) => (
                <View key={sp.sport_type} style={styles.sportRow}>
                  <View style={[styles.sportDot, { backgroundColor: (Colors as any)[sp.sport_type] ?? Colors.orange }]} />
                  <Text style={styles.sportName}>{sportLabel(sp.sport_type)}</Text>
                  <Text style={styles.sportCount}>{sp.count} activities</Text>
                  <Text style={styles.sportDist}>{formatDistance(sp.distance)} km</Text>
                </View>
              ))}
            </View>
          )}

          {/* Advanced analytics — Premium gate */}
          {!isPremium ? (
            <View style={styles.section}>
              <PremiumGate
                feature="Advanced Analytics"
                description="Training load, fitness/freshness curves, zone distribution, and AI-powered coaching insights."
              />
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Training Load (CTL/ATL)</Text>
              <View style={styles.premiumPlaceholder}>
                <Text style={styles.premiumPlaceholderText}>
                  Fitness (CTL): 42 · Fatigue (ATL): 38 · Form (TSB): +4
                </Text>
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

function TotalCard({ label, value, unit, icon }: { label: string; value: string; unit: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.totalCard}>
      <Ionicons name={icon} size={18} color={Colors.orange} style={{ marginBottom: 6 }} />
      <View style={styles.totalValueRow}>
        <Text style={styles.totalValue}>{value}</Text>
        {unit ? <Text style={styles.totalUnit}>{unit}</Text> : null}
      </View>
      <Text style={styles.totalLabel}>{label}</Text>
    </View>
  );
}

function WeeklyChart({ weeks }: { weeks: ReturnType<typeof useAnalytics>["data"] extends null ? never : ReturnType<typeof useAnalytics>["data"]["weeks"] }) {
  const maxDist = Math.max(...weeks.map((w) => w.distance), 1);
  const chartW = SCREEN_W - 64;
  const barW = Math.max(8, (chartW / weeks.length) - 4);

  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartBars}>
        {weeks.map((w, i) => {
          const h = Math.max(4, ((w.distance / maxDist) * 100));
          return (
            <View key={i} style={styles.chartBarCol}>
              <View
                style={[
                  styles.chartBar,
                  {
                    height: `${h}%`,
                    width: barW,
                    backgroundColor: i === weeks.length - 1 ? Colors.orange : Colors.bgElevated,
                  },
                ]}
              />
              <Text style={styles.chartLabel} numberOfLines={1}>
                {w.weekLabel.split(" ")[0]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  center: { alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { color: Colors.text, fontSize: 22, fontWeight: "800" },
  periodRow: {
    flexDirection: "row",
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    padding: 3,
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full },
  periodBtnActive: { backgroundColor: Colors.orange },
  periodLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: "600" },
  periodLabelActive: { color: "#000" },
  totalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  totalCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  totalValueRow: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  totalValue: { color: Colors.text, fontSize: 24, fontWeight: "800" },
  totalUnit: { color: Colors.textSecondary, fontSize: 13 },
  totalLabel: { color: Colors.textMuted, fontSize: 11, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  streakItem: { alignItems: "center", flex: 1 },
  streakValue: { color: Colors.orange, fontSize: 32, fontWeight: "900" },
  streakLabel: { color: Colors.textMuted, fontSize: 11, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  streakDivider: { width: 1, height: 40, backgroundColor: Colors.border, marginHorizontal: 8 },
  section: { marginBottom: 20 },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: "700", marginBottom: 12 },
  chartWrap: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 140,
  },
  chartBars: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  chartBarCol: { alignItems: "center", gap: 4, flex: 1 },
  chartBar: { borderRadius: 4, minHeight: 4 },
  chartLabel: { color: Colors.textMuted, fontSize: 9 },
  sportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  sportDot: { width: 10, height: 10, borderRadius: 5 },
  sportName: { color: Colors.text, fontSize: 14, fontWeight: "600", flex: 1 },
  sportCount: { color: Colors.textMuted, fontSize: 12 },
  sportDist: { color: Colors.textSecondary, fontSize: 14, fontWeight: "600" },
  premiumPlaceholder: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  premiumPlaceholderText: { color: Colors.text, fontSize: 14 },
  empty: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyTitle: { color: Colors.text, fontSize: 18, fontWeight: "700" },
  emptyText: { color: Colors.textSecondary, fontSize: 14, textAlign: "center", lineHeight: 20 },
});
