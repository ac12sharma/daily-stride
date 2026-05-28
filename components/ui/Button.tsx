import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, type ViewStyle } from "react-native";
import { Colors, Radius, Shadow } from "@/lib/colors";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  label, onPress, variant = "primary", size = "md",
  loading, disabled, style,
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        variant === "primary" && Shadow.orange,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#000" : Colors.orange}
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`label_${size}`]]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: Colors.orange,
  },
  secondary: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: "rgba(244,67,54,0.15)",
    borderWidth: 1,
    borderColor: Colors.error,
  },
  sm: { paddingHorizontal: 16, paddingVertical: 8, minWidth: 80 },
  md: { paddingHorizontal: 24, paddingVertical: 13, minWidth: 120 },
  lg: { paddingHorizontal: 32, paddingVertical: 16, minWidth: 160 },
  disabled: { opacity: 0.45 },

  label: { fontWeight: "700", letterSpacing: 0.3 },
  label_primary: { color: "#000" },
  label_secondary: { color: Colors.text },
  label_ghost: { color: Colors.orange },
  label_danger: { color: Colors.error },
  label_sm: { fontSize: 13 },
  label_md: { fontSize: 15 },
  label_lg: { fontSize: 17 },
});
