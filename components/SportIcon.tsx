import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/colors";
import type { SportType } from "@/types";

const SPORT_CONFIG: Record<SportType, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  run: { icon: "walk", color: Colors.run },
  ride: { icon: "bicycle", color: Colors.ride },
  walk: { icon: "footsteps", color: Colors.walk },
  hike: { icon: "trail-sign", color: Colors.hike },
  swim: { icon: "water", color: Colors.swim },
};

interface Props {
  type: SportType;
  size?: number;
  showBackground?: boolean;
}

export default function SportIcon({ type, size = 20, showBackground = true }: Props) {
  const cfg = SPORT_CONFIG[type] ?? SPORT_CONFIG.run;
  return (
    <View
      style={[
        showBackground && styles.bg,
        showBackground && { backgroundColor: cfg.color + "20" },
        showBackground && { width: size + 16, height: size + 16, borderRadius: (size + 16) / 2 },
      ]}
    >
      <Ionicons name={cfg.icon} size={size} color={cfg.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    alignItems: "center",
    justifyContent: "center",
  },
});
