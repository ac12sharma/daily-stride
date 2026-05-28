import { View, StyleSheet } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import type { Coordinate } from "@/types";
import { Colors } from "@/lib/colors";

interface Props {
  coordinates: Coordinate[];
  height?: number;
  interactive?: boolean;
  accentColor?: string;
}

export default function RouteMap({
  coordinates,
  height = 200,
  interactive = false,
  accentColor = Colors.orange,
}: Props) {
  if (coordinates.length === 0) return <View style={[styles.placeholder, { height }]} />;

  const lats = coordinates.map((c) => c.latitude);
  const lngs = coordinates.map((c) => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const region = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.4, 0.002),
    longitudeDelta: Math.max((maxLng - minLng) * 1.4, 0.002),
  };

  const start = coordinates[0];
  const end = coordinates[coordinates.length - 1];

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        region={region}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={false}
        pitchEnabled={false}
        customMapStyle={DARK_MAP_STYLE}
      >
        <Polyline
          coordinates={coordinates}
          strokeColor={accentColor}
          strokeWidth={3}
          lineDashPattern={undefined}
        />
        {/* Start dot */}
        <Polyline
          coordinates={[start, start]}
          strokeColor="#4CAF50"
          strokeWidth={10}
        />
        {/* End dot */}
        <Polyline
          coordinates={[end, end]}
          strokeColor={Colors.error}
          strokeWidth={10}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: Colors.bgCard,
  },
  placeholder: {
    backgroundColor: Colors.bgCard,
  },
});

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];
