import { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";
import { Colors, Radius } from "@/lib/colors";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);

  const signInWithGoogle = async () => {
    setLoading("google");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "stride://auth/callback",
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, "stride://");
        if (result.type === "success") {
          const url = new URL(result.url);
          const code = url.searchParams.get("code");
          if (code) {
            await supabase.auth.exchangeCodeForSession(code);
          }
        }
      }
    } catch (e: any) {
      Alert.alert("Sign in failed", e.message);
    } finally {
      setLoading(null);
    }
  };

  const signInWithApple = async () => {
    setLoading("apple");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: "stride://auth/callback",
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, "stride://");
        if (result.type === "success") {
          const url = new URL(result.url);
          const code = url.searchParams.get("code");
          if (code) await supabase.auth.exchangeCodeForSession(code);
        }
      }
    } catch (e: any) {
      Alert.alert("Sign in failed", e.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={["#1a0a00", Colors.bg]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo / Hero */}
        <View style={styles.hero}>
          <View style={styles.logoRing}>
            <Ionicons name="footsteps" size={40} color={Colors.orange} />
          </View>
          <Text style={styles.appName}>STRIDE</Text>
          <Text style={styles.tagline}>Track. Compete. Conquer.</Text>
        </View>

        {/* Feature pills */}
        <View style={styles.features}>
          {["GPS Route Tracking", "Live Leaderboards", "Training Analytics", "Social Feed"].map((f) => (
            <View key={f} style={styles.featurePill}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.orange} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Auth buttons */}
        <View style={styles.buttons}>
          <OAuthButton
            label="Continue with Google"
            icon="logo-google"
            onPress={signInWithGoogle}
            loading={loading === "google"}
            disabled={loading !== null}
          />
          <OAuthButton
            label="Continue with Apple"
            icon="logo-apple"
            onPress={signInWithApple}
            loading={loading === "apple"}
            disabled={loading !== null}
          />
        </View>

        <Text style={styles.legal}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function OAuthButton({
  label, icon, onPress, loading, disabled,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.oauthBtn, disabled && { opacity: 0.5 }]}
    >
      {loading ? (
        <View style={styles.oauthSpinner}>
          <Ionicons name="sync" size={20} color={Colors.text} />
        </View>
      ) : (
        <Ionicons name={icon} size={22} color={Colors.text} />
      )}
      <Text style={styles.oauthLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    paddingTop: 80,
  },
  hero: { alignItems: "center", marginBottom: 40 },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.orangeDim,
    borderWidth: 2,
    borderColor: Colors.orange,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  appName: {
    color: Colors.text,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 6,
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: 15,
    marginTop: 6,
    letterSpacing: 1,
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 48,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureText: { color: Colors.textSecondary, fontSize: 12, fontWeight: "500" },
  buttons: { width: "100%", gap: 12, marginBottom: 24 },
  oauthBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.xl,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  oauthLabel: { color: Colors.text, fontSize: 16, fontWeight: "600" },
  oauthSpinner: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  legal: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});
