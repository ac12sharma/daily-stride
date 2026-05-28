import { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator,
} from "react-native";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Colors, Radius } from "@/lib/colors";
import { supabase } from "@/lib/supabase";
import { formatDistance, formatDuration } from "@/lib/formatters";
import type { Segment } from "@/types";
import PremiumGate from "@/components/PremiumGate";
import { useAuth } from "@/hooks/useAuth";

type View = "map" | "list";

export default function ExploreScreen() {
  const { profile } = useAuth();
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<View>("map");
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selected, setSelected] = useState<Segment | null>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      .then((loc) => {
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      })
      .catch(() => {});

    loadSegments();
  }, []);

  const loadSegments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("segments")
      .select("*")
      .order("effort_count", { ascending: false })
      .limit(30);
    setSegments((data ?? []) as Segment[]);
    setLoading(false);
  };

  // Premium gate for full segment leaderboards
  const isPremium = profile?.is_premium ?? false;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.toggle}>
          <TouchableOpacity
            onPress={() => setView("map")}
            style={[styles.toggleBtn, view === "map" && styles.toggleBtnActive]}
          >
            <Ionicons name="map" size={16} color={view === "map" ? "#000" : Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setView("list")}
            style={[styles.toggleBtn, view === "list" && styles.toggleBtnActive]}
          >
            <Ionicons name="list" size={16} color={view === "list" ? "#000" : Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {view === "map" ? (
        <View style={styles.mapWrap}>
          <MapView
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_GOOGLE}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation
            customMapStyle={DARK_MAP_STYLE}
          >
            {segments.map((seg) =>
              seg.start_latlng ? (
                <Marker
                  key={seg.id}
                  coordinate={{ latitude: seg.start_latlng[0], longitude: seg.start_latlng[1] }}
                  onPress={() => setSelected(seg)}
                >
                  <View style={[styles.segMarker, selected?.id === seg.id && styles.segMarkerActive]}>
                    <Ionicons name="flag" size={14} color={selected?.id === seg.id ? "#000" : Colors.orange} />
                  </View>
                </Marker>
              ) : null
            )}
          </MapView>

          {/* Selected segment card */}
          {selected && (
            <BlurView intensity={60} tint="dark" style={styles.segCard}>
              <View style={styles.segCardContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.segName} numberOfLines={1}>{selected.name}</Text>
                  <Text style={styles.segMeta}>
                    {formatDistance(selected.distance)} km ·{" "}
                    {selected.average_grade.toFixed(1)}% avg grade ·{" "}
                    {selected.effort_count} efforts
                  </Text>
                  {selected.kom_time && (
                    <View style={styles.komRow}>
                      <Ionicons name="trophy" size={12} color={Colors.premium} />
                      <Text style={styles.komText}>KOM {formatDuration(selected.kom_time)}</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => setSelected(null)}>
                  <Ionicons name="close-circle" size={22} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </BlurView>
          )}
        </View>
      ) : loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.orange} />
        </View>
      ) : (
        <FlatList
          data={segments}
          keyExtractor={(s) => s.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 90 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.segRow}
              onPress={() => setSelected(item)}
              activeOpacity={0.8}
            >
              <View style={styles.segIconWrap}>
                <Ionicons name="flag" size={20} color={Colors.orange} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.segName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.segMeta}>
                  {formatDistance(item.distance)} km · {item.average_grade.toFixed(1)}% · {item.effort_count} efforts
                </Text>
              </View>
              {item.kom_time && isPremium && (
                <View style={styles.komBadge}>
                  <Ionicons name="trophy" size={10} color={Colors.premium} />
                  <Text style={styles.komBadgeText}>{formatDuration(item.kom_time)}</Text>
                </View>
              )}
              {!isPremium && (
                <Ionicons name="lock-closed" size={14} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            !isPremium ? (
              <View style={styles.premiumBanner}>
                <Ionicons name="trophy" size={16} color={Colors.premium} />
                <Text style={styles.premiumBannerText}>
                  Upgrade to Premium to see full leaderboards & KOM times
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { color: Colors.text, fontSize: 22, fontWeight: "800" },
  toggle: {
    flexDirection: "row",
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    padding: 3,
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtn: {
    width: 36,
    height: 30,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBtnActive: { backgroundColor: Colors.orange },
  mapWrap: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  segMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgElevated,
    borderWidth: 2,
    borderColor: Colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  segMarkerActive: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orangeLight,
  },
  segCard: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    borderRadius: Radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  segCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  segRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.orangeDim,
    alignItems: "center",
    justifyContent: "center",
  },
  segName: { color: Colors.text, fontSize: 14, fontWeight: "600", marginBottom: 3 },
  segMeta: { color: Colors.textMuted, fontSize: 12 },
  komRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  komText: { color: Colors.premium, fontSize: 12, fontWeight: "600" },
  komBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255,215,0,0.12)",
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  komBadgeText: { color: Colors.premium, fontSize: 11, fontWeight: "600" },
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,215,0,0.08)",
    borderRadius: Radius.lg,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.2)",
  },
  premiumBannerText: { color: Colors.textSecondary, fontSize: 13, flex: 1 },
});

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];
