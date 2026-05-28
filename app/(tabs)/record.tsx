import { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, TextInput, Alert, ScrollView,
} from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Colors, Radius } from "@/lib/colors";
import { useGPSRecorder } from "@/hooks/useGPSRecorder";
import {
  formatDistance, formatDuration, formatPace,
  formatElevation, sportLabel,
} from "@/lib/formatters";
import type { SportType } from "@/types";

const SPORTS: SportType[] = ["run", "ride", "walk", "hike", "swim"];
const SPORT_ICONS: Record<SportType, keyof typeof Ionicons.glyphMap> = {
  run: "walk", ride: "bicycle", walk: "footsteps", hike: "trail-sign", swim: "water",
};

export default function RecordScreen() {
  const { state, stats, hasPermission, start, pause, resume, save, discard } = useGPSRecorder();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [sport, setSport] = useState<SportType>("run");
  const [showSave, setShowSave] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      .then((loc) =>
        setCurrentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
      )
      .catch(() => {});
  }, []);

  const handleStartPause = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (state === "idle") {
      await start();
    } else if (state === "recording") {
      pause();
    } else if (state === "paused") {
      await resume();
    }
  };

  const handleStop = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (stats.elapsed < 5) {
      Alert.alert("Discard?", "Your activity is very short. Discard it?", [
        { text: "Keep Going", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: discard },
      ]);
    } else {
      setActivityName(defaultName(sport));
      setShowSave(true);
    }
  };

  const handleSave = async () => {
    const id = await save(sport, activityName || defaultName(sport));
    setShowSave(false);
    if (id) router.push(`/activity/${id}`);
  };

  const coords = stats.coordinates;
  const isActive = state === "recording" || state === "paused";

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Map */}
      <View style={styles.mapContainer}>
        {(currentLocation || coords.length > 0) && (
          <MapView
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_GOOGLE}
            region={
              coords.length > 0
                ? {
                    latitude: coords[coords.length - 1].latitude,
                    longitude: coords[coords.length - 1].longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }
                : {
                    latitude: currentLocation!.latitude,
                    longitude: currentLocation!.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }
            }
            followsUserLocation={state === "recording"}
            showsUserLocation
            customMapStyle={DARK_MAP_STYLE}
          >
            {coords.length > 1 && (
              <Polyline
                coordinates={coords}
                strokeColor={Colors.orange}
                strokeWidth={4}
              />
            )}
          </MapView>
        )}

        {/* Gradient overlay at bottom */}
        <LinearGradient
          colors={["transparent", Colors.bg]}
          style={styles.mapGradient}
          pointerEvents="none"
        />
      </View>

      {/* Sport selector (only when idle) */}
      {state === "idle" && (
        <View style={styles.sportRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sportScroll}>
            {SPORTS.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setSport(s)}
                style={[styles.sportChip, sport === s && styles.sportChipActive]}
              >
                <Ionicons
                  name={SPORT_ICONS[s]}
                  size={16}
                  color={sport === s ? "#000" : Colors.textSecondary}
                />
                <Text style={[styles.sportLabel, sport === s && styles.sportLabelActive]}>
                  {sportLabel(s)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Live stats (when recording/paused) */}
      {isActive && (
        <View style={styles.statsGrid}>
          <BigStat
            label="Distance"
            value={formatDistance(stats.distance)}
            unit="km"
          />
          <BigStat
            label="Duration"
            value={formatDuration(stats.elapsed)}
            unit=""
          />
          <BigStat
            label="Pace"
            value={formatPace(stats.averageSpeed)}
            unit="/km"
          />
          <BigStat
            label="Elevation"
            value={formatElevation(stats.elevationGain)}
            unit=""
          />
        </View>
      )}

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 90 }]}>
        {/* Stop button (when recording) */}
        {isActive && (
          <TouchableOpacity onPress={handleStop} style={styles.stopBtn} activeOpacity={0.8}>
            <View style={styles.stopIcon} />
          </TouchableOpacity>
        )}

        {/* Start / Pause / Resume */}
        <TouchableOpacity
          onPress={handleStartPause}
          style={[styles.mainBtn, state === "paused" && styles.mainBtnResume]}
          activeOpacity={0.85}
        >
          <Ionicons
            name={
              state === "idle" ? "play" :
              state === "recording" ? "pause" : "play"
            }
            size={32}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {/* Save modal */}
      <Modal visible={showSave} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 20 }]}>
            <Text style={styles.modalTitle}>Save Activity</Text>
            <View style={styles.modalStats}>
              <ModalStat label="Distance" value={`${formatDistance(stats.distance)} km`} />
              <ModalStat label="Time" value={formatDuration(stats.elapsed)} />
              <ModalStat label="Elevation" value={formatElevation(stats.elevationGain)} />
            </View>
            <TextInput
              value={activityName}
              onChangeText={setActivityName}
              placeholder="Activity name"
              placeholderTextColor={Colors.textMuted}
              style={styles.nameInput}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setShowSave(false); discard(); }}
              style={styles.discardBtn}
            >
              <Text style={styles.discardText}>Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Permission denied notice */}
      {!hasPermission && state === "idle" && (
        <View style={styles.permissionBanner}>
          <Ionicons name="location-outline" size={16} color={Colors.warning} />
          <Text style={styles.permissionText}>
            Location permission needed for GPS tracking
          </Text>
        </View>
      )}
    </View>
  );
}

function BigStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.bigStatItem}>
      <View style={styles.bigStatValueRow}>
        <Text style={styles.bigStatValue}>{value}</Text>
        {unit ? <Text style={styles.bigStatUnit}>{unit}</Text> : null}
      </View>
      <Text style={styles.bigStatLabel}>{label}</Text>
    </View>
  );
}

function ModalStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.modalStatItem}>
      <Text style={styles.modalStatValue}>{value}</Text>
      <Text style={styles.modalStatLabel}>{label}</Text>
    </View>
  );
}

function defaultName(sport: SportType): string {
  const hour = new Date().getHours();
  const time = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
  return `${time} ${sportLabel(sport)}`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  mapContainer: { flex: 1 },
  mapGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  sportRow: { paddingVertical: 12 },
  sportScroll: { paddingHorizontal: 20, gap: 8 },
  sportChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sportChipActive: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  sportLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: "600" },
  sportLabelActive: { color: "#000" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 2,
  },
  bigStatItem: {
    width: "50%",
    alignItems: "center",
    paddingVertical: 10,
  },
  bigStatValueRow: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  bigStatValue: { color: Colors.text, fontSize: 36, fontWeight: "800" },
  bigStatUnit: { color: Colors.textSecondary, fontSize: 14, marginBottom: 4 },
  bigStatLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    paddingTop: 16,
    paddingHorizontal: 40,
  },
  mainBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.orange,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  mainBtnResume: { backgroundColor: Colors.success },
  stopBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.bgElevated,
    borderWidth: 2,
    borderColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  stopIcon: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: Colors.bgModal,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: 24,
    gap: 16,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  modalStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  modalStatItem: { alignItems: "center", gap: 4 },
  modalStatValue: { color: Colors.text, fontSize: 22, fontWeight: "700" },
  modalStatLabel: { color: Colors.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 },
  nameInput: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveBtn: {
    backgroundColor: Colors.orange,
    borderRadius: Radius.xl,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: { color: "#000", fontSize: 16, fontWeight: "700" },
  discardBtn: { alignItems: "center", paddingVertical: 8 },
  discardText: { color: Colors.error, fontSize: 15, fontWeight: "500" },
  permissionBanner: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,152,0,0.15)",
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  permissionText: { color: Colors.warning, fontSize: 13, flex: 1 },
});

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];
