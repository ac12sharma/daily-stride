import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Radius } from "@/lib/colors";
import Button from "./ui/Button";

interface Props {
  feature: string;
  description?: string;
}

export default function PremiumGate({ feature, description }: Props) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="lock-closed" size={28} color={Colors.premium} />
      </View>
      <Text style={styles.title}>{feature}</Text>
      {description && <Text style={styles.desc}>{description}</Text>}
      <Text style={styles.sub}>Available with Stride Premium</Text>
      <Button
        label="Upgrade to Premium"
        onPress={() => router.push("/premium")}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 32,
    gap: 8,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,215,0,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  desc: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  sub: {
    color: Colors.premium,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  btn: {
    marginTop: 16,
    alignSelf: "stretch",
    borderRadius: Radius.xl,
    backgroundColor: Colors.premium,
  },
});
