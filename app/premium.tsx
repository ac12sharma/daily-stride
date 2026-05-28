import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Colors, Radius } from "@/lib/colors";

const FEATURES = [
  { icon: "trophy", text: "Segment leaderboards & KOM tracking" },
  { icon: "bar-chart", text: "Advanced training analytics & fitness curves" },
  { icon: "heart", text: "Heart rate zone analysis" },
  { icon: "map", text: "Route & heatmap exploration" },
  { icon: "star", text: "Custom training plans" },
  { icon: "flash", text: "AI-powered coaching insights" },
  { icon: "people", text: "Group challenges & club features" },
  { icon: "shield-checkmark", text: "Priority support" },
];

const PLANS = [
  { id: "monthly", label: "Monthly", price: "$7.99", period: "/month", badge: null },
  { id: "annual", label: "Annual", price: "$47.99", period: "/year", badge: "Save 50%", priceNote: "$3.99/mo" },
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSubscribe = async (planId: string) => {
    // Stripe integration goes here
    // await stripeSubscribe(planId)
    router.back();
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["rgba(255,215,0,0.12)", Colors.bg]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
      />

      {/* Close */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.closeBtn, { top: insets.top + 12 }]}
      >
        <Ionicons name="close" size={22} color={Colors.text} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 },
        ]}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.starWrap}>
            <Ionicons name="star" size={36} color={Colors.premium} />
          </View>
          <Text style={styles.heroTitle}>Stride Premium</Text>
          <Text style={styles.heroSub}>
            Unlock your full athletic potential
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresList}>
          {FEATURES.map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={f.icon as any} size={18} color={Colors.premium} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plansRow}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, plan.id === "annual" && styles.planCardHighlight]}
              onPress={() => handleSubscribe(plan.id)}
              activeOpacity={0.85}
            >
              {plan.badge && (
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>{plan.badge}</Text>
                </View>
              )}
              <Text style={styles.planLabel}>{plan.label}</Text>
              <Text style={[styles.planPrice, plan.id === "annual" && styles.planPriceHighlight]}>
                {plan.price}
              </Text>
              <Text style={styles.planPeriod}>{plan.period}</Text>
              {plan.priceNote && (
                <Text style={styles.planNote}>{plan.priceNote}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={() => handleSubscribe("annual")}
          style={styles.cta}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.premium, "#FFA000"]}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Start Free 7-Day Trial</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.legal}>
          Cancel anytime. Free trial converts to paid subscription after 7 days.
          Payments processed securely via Stripe.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  closeBtn: {
    position: "absolute",
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 24 },
  hero: { alignItems: "center", marginBottom: 32 },
  starWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,215,0,0.15)",
    borderWidth: 2,
    borderColor: "rgba(255,215,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: { color: Colors.text, fontSize: 28, fontWeight: "900", letterSpacing: 1 },
  heroSub: { color: Colors.textSecondary, fontSize: 15, marginTop: 6 },
  featuresList: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 14,
    marginBottom: 24,
  },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,215,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { color: Colors.text, fontSize: 14, fontWeight: "500", flex: 1 },
  plansRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  planCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: "center",
    gap: 4,
    position: "relative",
    overflow: "hidden",
  },
  planCardHighlight: {
    borderColor: Colors.premium,
    backgroundColor: "rgba(255,215,0,0.06)",
  },
  planBadge: {
    backgroundColor: Colors.premium,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 4,
  },
  planBadgeText: { color: "#000", fontSize: 11, fontWeight: "800" },
  planLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: "600" },
  planPrice: { color: Colors.text, fontSize: 24, fontWeight: "800" },
  planPriceHighlight: { color: Colors.premium },
  planPeriod: { color: Colors.textMuted, fontSize: 12 },
  planNote: { color: Colors.premium, fontSize: 11, fontWeight: "600" },
  cta: {
    borderRadius: Radius.xl,
    overflow: "hidden",
    marginBottom: 16,
  },
  ctaGradient: {
    paddingVertical: 17,
    alignItems: "center",
  },
  ctaText: { color: "#000", fontSize: 17, fontWeight: "800" },
  legal: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});
